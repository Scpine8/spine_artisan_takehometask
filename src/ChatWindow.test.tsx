import React from 'react';
import useChatData, { Message, UseChatDataReturn } from './useChatData';

jest.mock('./useChatData');

describe('Chat Window tests', () => {
  const deleteMessageMock = jest.fn();
  const loading = false;
  let messages: Message[] = [];
  let context = 'Sales';
  const setContextMock = jest.fn();
  const sendMessageMock = jest.fn();
  const updateMessageMock = jest.fn();

  beforeEach(() => {
    (useChatData as jest.Mock<UseChatDataReturn>).mockReturnValue({
      messages,
      context,
      deleteMessage: deleteMessageMock,
      sendMessage: sendMessageMock,
      setContext: setContextMock,
      updateMessage: updateMessageMock,
      loading,
    });
  });

  it.todo('message is not sent if user does not type anything');
  it.todo('message is sent if user types a message and clicks the send button');
  it.todo('message is sent if user types a message and hits the enter key');

  it.todo(
    'if user selects Delete from the message box menu, the delete query is called'
  );
  it.todo(
    'user can trigger the edit query by selecting Edit from the message box menu and confirming a change'
  );
  it.todo(
    'if user clicks confirm while in the edit view but no changes are made, edit query is NOT called'
  );

  it.todo(
    'setContext is called when user selects a new context from the dropdown'
  );

  // Error Cases:

  it.todo(
    'if there is an error fetching messages, banner is displayed to the user'
  );
  it.todo(
    'if there is an error sending a message, banner is displayed to the user'
  );
  it.todo(
    'if there is an error while editing a message, a banner is displayed to the user'
  );
  it.todo(
    'if there is an error while deleting a message, a banner is displayed to the user'
  );
});
