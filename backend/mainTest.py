import pytest
from fastapi.testclient import TestClient
from main import app, chat_history, message_id_counter
from unittest.mock import patch

client = TestClient(app)


## DRAFT

@pytest.fixture(autouse=True)
def setup_test_data():
    """
    Resets the in-memory storage before each test.
    """
    global chat_history, message_id_counter
    chat_history.clear()
    chat_history[1] = {
        "id": 1,
        "senderId": 42,
        "text": "How can I help you today?"
    }
    message_id_counter = 2


@patch("main.client.chat.completions.create")
def test_post_chat(mock_openai):
    """
    Tests the /chat endpoint with a mocked OpenAI completion call.
    """
    # Mock OpenAI response
    mock_openai.return_value = {
        "choices": [{"message": {"content": "Mocked AI response"}}]
    }

    response = client.post(
        "/chat",
        json={
            "userId": 123,
            "message": "What is the capital of France?",
            "context": "geography"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "response" in data
    assert "messages" in data
    assert len(chat_history) == 3
    assert data["response"] == "Mocked AI response"


def test_get_messages():
    """
    Tests the /chat GET endpoint to retrieve messages.
    """
    response = client.get("/chat")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["text"] == "How can I help you today?"


def test_update_message():
    """
    Tests the /chat/{messageId} PUT endpoint for updating a message.
    """
    response = client.put(
        "/chat/1",
        json={"newMessage": "Updated message text"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert len(data["updatedMessages"]) == 2
    assert chat_history[1]["text"] == "Updated message text"


def test_delete_message():
    """
    Tests the /chat/{messageId} DELETE endpoint for deleting a message.
    """
    response = client.delete("/chat/1")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == 1
    assert data["status"] == "deleted"
    assert len(chat_history.values()) == 0