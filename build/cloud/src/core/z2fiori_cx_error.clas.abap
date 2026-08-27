CLASS z2fiori_cx_error DEFINITION
  PUBLIC
  INHERITING FROM cx_no_check FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_t100_message.

    CONSTANTS:
      BEGIN OF z2fiori_cx_error,
        msgid TYPE symsgid      VALUE '00',
        msgno TYPE symsgno      VALUE '001',
        attr1 TYPE scx_attrname VALUE 'A1',
        attr2 TYPE scx_attrname VALUE 'A2',
        attr3 TYPE scx_attrname VALUE 'A3',
        attr4 TYPE scx_attrname VALUE 'A4',
      END OF z2fiori_cx_error.

    DATA message TYPE string READ-ONLY.
    DATA a1      TYPE symsgv READ-ONLY.
    DATA a2      TYPE symsgv READ-ONLY.
    DATA a3      TYPE symsgv READ-ONLY.
    DATA a4      TYPE symsgv READ-ONLY.

    METHODS constructor
      IMPORTING textid    LIKE if_t100_message=>t100key OPTIONAL
                !previous LIKE previous                 OPTIONAL
                !message  TYPE string                   OPTIONAL
                a1        TYPE symsgv                   OPTIONAL
                a2        TYPE symsgv                   OPTIONAL
                a3        TYPE symsgv                   OPTIONAL
                a4        TYPE symsgv                   OPTIONAL.

    CLASS-METHODS raise
      IMPORTING val       TYPE clike    OPTIONAL
                !previous LIKE previous OPTIONAL
        PREFERRED PARAMETER val.

    METHODS if_message~get_text REDEFINITION.

  PRIVATE SECTION.
ENDCLASS.


CLASS z2fiori_cx_error IMPLEMENTATION.
  METHOD constructor ##ADT_SUPPRESS_GENERATION.
    super->constructor( previous = previous ).
    me->message = message.
    me->a1      = a1.
    me->a2      = a2.
    me->a3      = a3.
    me->a4      = a4.
    CLEAR me->textid.
    IF textid IS INITIAL.
      if_t100_message~t100key = z2fiori_cx_error.
    ELSE.
      if_t100_message~t100key = textid.
    ENDIF.
  ENDMETHOD.

  METHOD if_message~get_text.
    IF message IS NOT INITIAL.
      result = message.
    ELSEIF previous IS BOUND.
      result = previous->get_text( ).
    ELSE.
      result = super->get_text( ).
    ENDIF.
  ENDMETHOD.

  METHOD raise.
    RAISE EXCEPTION NEW z2fiori_cx_error( message  = val
                                          previous = previous ).
  ENDMETHOD.
ENDCLASS.
