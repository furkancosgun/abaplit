INTERFACE z2fiori_if_http
  PUBLIC.

  METHODS get_binary
    RETURNING VALUE(result) TYPE xstring.

  METHODS get_header
    IMPORTING name          TYPE string
    RETURNING VALUE(result) TYPE string.

  METHODS get_method
    RETURNING VALUE(result) TYPE string.

  METHODS get_path
    RETURNING VALUE(result) TYPE string.

  METHODS get_query
    IMPORTING name          TYPE string
    RETURNING VALUE(result) TYPE string.

  METHODS get_text
    RETURNING VALUE(result) TYPE string.

  METHODS set_binary
    IMPORTING binary TYPE xstring.

  METHODS set_header
    IMPORTING name  TYPE string
              value TYPE string.

  METHODS set_status
    IMPORTING status TYPE i.

  METHODS set_text
    IMPORTING text TYPE string.

  METHODS set_compression.

ENDINTERFACE.
