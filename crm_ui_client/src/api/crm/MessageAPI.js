import {buildUrl} from "../utils/buildUrlQueryParams.js"
import {Message} from "./dto/Message.ts"
import {MessageHistory} from "./dto/MessageHistory.ts"


const URL_MESSAGES = 'http://localhost:8082/crm/api/messages'


async function GetMessages(filter, pagination) {
    const response = await fetch(
        buildUrl(URL_MESSAGES, filter, pagination), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => Message.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function GetMessageById(messageId) {
    const response = await fetch(
        buildUrl(`${URL_MESSAGES}/${messageId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return Message.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function GetMessageHistoryById(messageId) {
    const response = await fetch(
        buildUrl(`${URL_MESSAGES}/${messageId}/history`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => MessageHistory.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function InsertNewMessage(message) {
    const response = await fetch(
        buildUrl(URL_MESSAGES, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(message)
        })

    const obj = await response.json()

    if (response.ok) {
        return Message.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdatePriorityOfMessage(messageId, priority) {
    const response = await fetch(
        buildUrl(`${URL_MESSAGES}/${messageId}/priority`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: priority
        })

    const obj = await response.json()

    if (response.ok) {
        return Message.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateStatusOfMessage(messageId, messageHistory) {
    const response = await fetch(
        buildUrl(`${URL_MESSAGES}/${messageId}/status`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({messageHistory})
        })

    const obj = await response.json()

    if (response.ok) {
        return Message.fromJsonObject(obj)
    } else {
        throw obj
    }
}


const MessageAPI = {
    GetMessages,
    GetMessageById,
    GetMessageHistoryById,
    InsertNewMessage,
    UpdatePriorityOfMessage,
    UpdateStatusOfMessage
}

export default MessageAPI
