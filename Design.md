# Overall Architecture

## MVP

### Frontend

#### Components

- **ChatWindow**
  - **Wrapper**: Includes escape "X", minimize/maximize window, miniwindow popout.
  - **Header**: Displays AI Employee greeting, subheader text, and icon.
  - **Chatbox**:
    - Infinite scroll, message boxes, and action buttons (e.g., delete, edit).
    - **Message**: Rounded, colored message box.
      - On hover: Displays "..." menu for edit/delete options.
      - Edit: Converts box into input with "Cancel (X)" and "Confirm (✔)" buttons.
      - Delete: Prompts confirmation ("Cancel", "Delete").
  - **Input Box**:
    - Includes customer photo icon and text box.
    - Default: "Shift+Enter" sends the message. "Enter" adds a new line. (Consider a character limit.)
  - **Footer**:
    - **Context**: Dropdown for AI guidance (1-3 categories).
    - **Settings**: Gear icon opens a modal for options.
    - **Send**: Right arrow icon sends the message.

#### Functionality

1. **Send Message**
   - Sends message to OpenAI API using the selected context.
   - Displays message in Chatbox and stores the thread in the backend.
2. **Delete Message**
   - Calls `delete` API after confirmation, updates DB, refetches messages, and refreshes the view.
3. **Edit Message**
   - Calls `edit` API after confirmation, updates DB, refetches messages, and refreshes the view.
4. **Get Messages**
   - Fetches messages based on `chatId`, displays a loader until fetched.

#### Testing

- **Unit Tests**: _TODO_
- **E2E Tests**: _TODO_
- **Observability/Logging**: _TODO_

#### Dependencies

- **lucide-react**: For icons ([lucide.dev](https://lucide.dev/icons/))
- **Prettier/ESLint**: For linting/formatting

### Backend

#### Components

#### Endpoints

- **Chat** (`POST /chat`)

  - Accepts a JSON payload containing:
    - `userId`: ID of the user sending the message.
    - `message`: The user's input message.
    - `context`: A category that guides the AI's response (e.g., sales, support).
  - Utilizes OpenAI's API to generate a contextual response.
  - Updates the in-memory `chat_history` with both user and AI messages.
  - Returns the AI's response and the updated `chat_history`.

- **Get Messages** (`GET /chat`)

  - Retrieves all messages from `chat_history`.
  - If the history is empty, initializes with a default AI introduction message.

- **Update Message** (`PUT /chat/{messageId}`)

  - Accepts a `messageId` and a JSON payload with `newMessage`.
  - Updates the message text in `chat_history`.
  - Sends the updated chat context to OpenAI for a refreshed AI response.
  - Returns the updated message and the updated `chat_history`.

- **Delete Message** (`DELETE /chat/{messageId}`)
  - Removes a specific message by `messageId` from `chat_history`.
  - Returns the ID of the deleted message and the updated `chat_history`.

#### Functionality

1. **Message Processing**

   - AI responses are generated using OpenAI's GPT-4 model.
   - Contextual prompts ensure responses align with specified categories (e.g., sales, support).
   - Chat history is used to provide continuity between messages.

2. **State Management**

   - In-memory storage (`chat_history`) holds chat messages, indexed by unique IDs.
   - Tracks `message_id_counter` to ensure unique message IDs.

3. **API Integration**

   - OpenAI API is used for generating AI responses.
   - Configured using the `OPENAI_API_KEY` from environment variables.

4. **CORS**
   - Configured to allow requests from the frontend (e.g., `http://localhost:5173`).
   - Supports all HTTP methods and headers.

#### Dependencies

- **FastAPI**: Framework for building backend services.
- **pydantic**: Ensures type validation for request and response data.
- **OpenAI**: Integration for AI-driven responses.
- **dotenv**: Loads environment variables (e.g., API keys).
- **CORS Middleware**: Enables cross-origin resource sharing for frontend-backend communication.

#### Testing

- **Unit Tests**: _TODO_
- **E2E Tests**: _TODO_
- **Observability/Logging**: _TODO_

### Scale for the Future

#### Pagination

• Use cursor-based pagination for consistent and efficient data retrieval, avoiding offset issues with large datasets.
• Fetch messages in small chunks (e.g., 20 per request) using a cursor (e.g., timestamp or message ID).

#### Caching

• Frontend Cache: Use client-side caching (e.g., React Query) to store already fetched messages for smooth scrolling.
• Backend Cache: Use Redis to store frequently accessed chat data (e.g., last 100 messages per chat).

#### Data Persistence

• Store Data in a PostgreSQL DB

#### Testing and Observability

• Extensive Unit Testing
• Adequate functional testing
• Clean Logging and interaction tracking to closely track user interactions and debug issues
