export const HTTP_WORDS = {
    GET:'GET',
    DELETE:'DELETE',
    POST:'POST',
    PUT:'PUT',
    OPTIONS:'OPTIONS',
}

export const COLLECTION = {
    CURRENT_COLLECTION:'myCollection'
}

export const INDEXES = {
    INDEXE_OWNER_ASC:'getTimelineByKeyAndOwnerKeyAsc',
    INDEXE_WRITE_ASC:'getTimelineByKeyAndWriteKeyAsc',
    INDEXE_OWNER_DESC:'getTimelineByKeyAndOwnerKeyDesc',
    INDEXE_WRITE_DESC:'getTimelineByKeyAndWriteKeyDesc',
    INDEXE_READ_DESC:'getTimelineByKeyAndReadKeyDesc'
}

export const REGEX = {
    ALPHANUM64:/^[0-9a-zA-Z]{64}$/g,
    ALPHANUM10:/^[0-9a-zA-Z]{10}$/g
}