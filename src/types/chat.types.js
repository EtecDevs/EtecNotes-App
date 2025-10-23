// src/types/chat.types.js

/**
 * @typedef {'student' | 'teacher' | 'admin' | 'secretary'} UserRole
 */

/**
 * @typedef {'sending' | 'sent' | 'delivered' | 'read'} MessageStatus
 */

/**
 * @typedef {'dm' | 'ticket'} ConversationType
 */

/**
 * @typedef {'online' | 'away' | 'offline'} UserStatus
 */

/**
 * @typedef {'aguardando' | 'em_analise' | 'em_andamento' | 'concluido' | 'cancelado'} TicketStatus
 */

/**
 * @typedef {'normal' | 'urgente'} TicketPriority
 */

/**
 * @typedef {Object} User
 * @property {number | string} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} [avatar]
 * @property {string} [course]
 * @property {string} [turma]
 * @property {string} [campus]
 * @property {UserStatus} status
 * @property {string} [subject]
 * @property {string | null} [lastSeen]
 */

/**
 * @typedef {Object} Attachment
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {number} size
 * @property {string} url
 */

/**
 * @typedef {Object} Message
 * @property {number | string} id
 * @property {number | string} senderId
 * @property {string} content
 * @property {Date} timestamp
 * @property {MessageStatus} status
 * @property {boolean} [isSystem]
 * @property {Attachment[]} [attachments]
 */

/**
 * @typedef {Object} TicketInfo
 * @property {string} protocol
 * @property {string} category
 * @property {string} subcategory
 * @property {TicketStatus} status
 * @property {TicketPriority} priority
 * @property {string} sla
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Conversation
 * @property {number | string} id
 * @property {ConversationType} type
 * @property {User} participant
 * @property {Object} lastMessage
 * @property {string} lastMessage.content
 * @property {Date} lastMessage.timestamp
 * @property {number | string} lastMessage.sender
 * @property {number} unreadCount
 * @property {string} [subject]
 * @property {TicketInfo} [ticketInfo]
 * @property {Message[]} messages
 */

/**
 * @typedef {Object} TicketCategory
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {string} color
 * @property {Array<{id: string, name: string}>} subcategories
 */

/**
 * @typedef {Object} TicketForm
 * @property {string} category
 * @property {string} subcategory
 * @property {string} campus
 * @property {string} course
 * @property {TicketPriority} priority
 * @property {string} description
 * @property {Attachment[]} attachments
 */

export {}
