import os
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.config import get_settings

class AgentService:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.gemini_api_key
        
        if not self.api_key or self.api_key == "your-gemini-api-key":
            self.client = None
            print("[NEXUS] WARNING: GEMINI_API_KEY is missing or invalid. Running AgentService in offline/demo mode.")
        else:
            self.client = genai.Client(api_key=self.api_key)

        self.model_name = settings.gemini_model or "gemini-2.0-flash"

    def get_system_instruction(self) -> str:
        return """You are NEXUS, an intelligent campus operations assistant.
You help students and staff with campus operations: reporting maintenance issues, booking rooms, finding campus information, and tracking requests.

You have access to several tools. When a user asks you to perform an action, you must use the appropriate tool.
- If the user wants to report an issue, use `create_incident`.
- If the user wants to book a room, use `create_booking`.
- If the user asks about room availability, use `check_room_availability`.

When an issue is reported, you MUST ask for clarifying details if location or description is missing.
If everything is provided, call `create_incident`. Show the user what you understood before calling the tool if it's a destructive/booking action, but for this demo, just call the tool.
Always be polite, concise, and professional. 
Do not hallucinate campus information; only use tools to retrieve real data.
"""

    def _get_tools(self):
        # Define the functions that Gemini can call
        return [
            types.FunctionDeclaration(
                name="create_incident",
                description="Creates a new incident report (maintenance, safety, IT, etc).",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "title": types.Schema(type=types.Type.STRING, description="Short summary of the issue."),
                        "description": types.Schema(type=types.Type.STRING, description="Detailed description."),
                        "location": types.Schema(type=types.Type.STRING, description="Where the issue is located."),
                        "category": types.Schema(
                            type=types.Type.STRING,
                            description="Category of the incident: maintenance, classroom, safety, energy, academic, campus_info."
                        ),
                        "priority": types.Schema(
                            type=types.Type.STRING,
                            description="Severity level: low, medium, high, critical."
                        )
                    },
                    required=["title", "description", "location", "category", "priority"]
                )
            ),
            types.FunctionDeclaration(
                name="check_room_availability",
                description="Checks if rooms are available, optionally filtering by type or status.",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "room_type": types.Schema(
                            type=types.Type.STRING, 
                            description="Type of room (e.g., classroom, lab, seminar_hall). Leave empty for all."
                        ),
                        "status": types.Schema(
                            type=types.Type.STRING,
                            description="Status of the room (e.g., available, occupied). Default to 'available' if they are looking for a free room."
                        )
                    }
                )
            ),
            types.FunctionDeclaration(
                name="create_booking",
                description="Requests a room booking.",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "room_id": types.Schema(type=types.Type.STRING, description="The ID of the room to book."),
                        "date": types.Schema(type=types.Type.STRING, description="Date in YYYY-MM-DD format."),
                        "start_time": types.Schema(type=types.Type.STRING, description="Start time in HH:MM format."),
                        "end_time": types.Schema(type=types.Type.STRING, description="End time in HH:MM format."),
                        "purpose": types.Schema(type=types.Type.STRING, description="Reason for booking."),
                        "expected_attendees": types.Schema(type=types.Type.INTEGER, description="Number of people.")
                    },
                    required=["room_id", "date", "start_time", "end_time", "purpose", "expected_attendees"]
                )
            )
        ]

    def _execute_tool(self, call: types.FunctionCall) -> Dict[str, Any]:
        """Executes the tool locally and returns the result."""
        from app.services.incidents import IncidentService
        from app.services.rooms import RoomService, BookingService
        from app.schemas.incidents import IncidentCreate
        from app.schemas.rooms import BookingCreate
        from datetime import datetime, timezone

        name = call.name
        args = call.args
        now = datetime.now(timezone.utc).isoformat()

        try:
            if name == "create_incident":
                inc_data = IncidentCreate(
                    title=args["title"],
                    description=args["description"],
                    location=args["location"],
                    category=args["category"],
                    priority=args["priority"]
                )
                doc_id = IncidentService.create(inc_data, "demo-user", now)
                return {"status": "success", "incident_id": doc_id, "message": "Incident created successfully."}
                
            elif name == "check_room_availability":
                target_status = args.get("status", "available")
                target_type = args.get("room_type")
                rooms = RoomService.list_all(building=None, status=target_status, min_capacity=None)
                
                filtered = []
                for r in rooms:
                    if target_type and r.get("room_type") != target_type:
                        continue
                    filtered.append({
                        "id": r.get("id"),
                        "name": r.get("name"),
                        "capacity": r.get("capacity"),
                        "building": r.get("building")
                    })
                return {"status": "success", "rooms": filtered}

            elif name == "create_booking":
                bk_data = BookingCreate(
                    room_id=args["room_id"],
                    date=args["date"],
                    start_time=args["start_time"],
                    end_time=args["end_time"],
                    purpose=args["purpose"],
                    expected_attendees=int(args["expected_attendees"])
                )
                doc_id = BookingService.create(bk_data, "AI Agent", "demo-user", "AI Agent", now)
                return {"status": "success", "booking_id": doc_id, "message": "Booking requested successfully."}
                
            else:
                return {"status": "error", "message": f"Unknown tool: {name}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def chat(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Process a chat conversation. `messages` is a list of {"role": "user"|"model", "content": "..."}
        Returns the new message from the model, including any tool outputs.
        """
        if not self.client:
            return {"role": "model", "content": "Gemini API key is not configured on the server. I am running in offline mode."}

        import base64
        # Convert simple dict messages to Gemini Content objects
        contents = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            parts = [types.Part.from_text(msg.get("content", ""))]
            if msg.get("image"):
                img_str = msg["image"]
                # parse data:image/jpeg;base64,...
                if "," in img_str:
                    header, b64 = img_str.split(",", 1)
                    mime = header.split(";")[0].split(":")[1]
                else:
                    b64 = img_str
                    mime = "image/jpeg"
                parts.append(types.Part.from_bytes(data=base64.b64decode(b64), mime_type=mime))
            contents.append(types.Content(role=role, parts=parts))

        tool_config = types.Tool(function_declarations=self._get_tools())
        
        config = types.GenerateContentConfig(
            system_instruction=self.get_system_instruction(),
            tools=[tool_config],
            temperature=0.2, # Low temperature for more deterministic tool calling
        )

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=contents,
            config=config
        )

        # Check if the model decided to call a function
        if response.function_calls:
            # We only handle the first function call for simplicity in this demo
            call = response.function_calls[0]
            print(f"Agent wants to call tool: {call.name} with args: {call.args}")
            
            tool_result = self._execute_tool(call)
            
            # Send the result back to Gemini so it can answer the user
            # We append the model's function call request to history
            contents.append(response.candidates[0].content)
            
            # We append the tool response
            part = types.Part.from_function_response(
                name=call.name,
                response=tool_result
            )
            contents.append(types.Content(role="user", parts=[part]))
            
            # Get the final answer
            final_response = self.client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=config
            )
            
            return {
                "role": "model", 
                "content": final_response.text, 
                "tool_called": call.name, 
                "tool_result": tool_result
            }

        return {"role": "model", "content": response.text}
