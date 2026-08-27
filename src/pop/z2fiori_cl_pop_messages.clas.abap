CLASS z2fiori_cl_pop_messages DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    TYPES:
      BEGIN OF ty_s_msg_entry,
        type    TYPE string,
        state   TYPE string,
        icon    TYPE string,
        message TYPE string,
        id      TYPE string,
        number  TYPE string,
      END OF ty_s_msg_entry,
      ty_t_msg_entry TYPE STANDARD TABLE OF ty_s_msg_entry WITH EMPTY KEY.

    DATA mv_title     TYPE string.
    DATA mt_messages  TYPE ty_t_msg_entry.

    CLASS-METHODS factory
      IMPORTING
        title         TYPE clike OPTIONAL
        t_bapiret2    TYPE bapirettab OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO z2fiori_cl_pop_messages.

    CLASS-METHODS factory_messages
      IMPORTING
        title         TYPE clike OPTIONAL
        t_messages    TYPE ty_t_msg_entry
      RETURNING
        VALUE(result) TYPE REF TO z2fiori_cl_pop_messages.

ENDCLASS.


CLASS z2fiori_cl_pop_messages IMPLEMENTATION.
  METHOD factory.
    DATA ls_bapi TYPE bapiret2.
    DATA ls_row  TYPE ty_s_msg_entry.

    result = NEW #( ).
    result->mv_title = title.
    IF result->mv_title IS INITIAL.
      result->mv_title = 'Messages'.
    ENDIF.

    LOOP AT t_bapiret2 INTO ls_bapi.
      CLEAR ls_row.
      ls_row-type    = ls_bapi-type.
      ls_row-message = ls_bapi-message.
      ls_row-id      = ls_bapi-id.
      ls_row-number  = |{ ls_bapi-number }|.

      CASE ls_bapi-type.
        WHEN 'E' OR 'A'.
          ls_row-state = 'Error'.
          ls_row-icon  = 'sap-icon://error'.
        WHEN 'W'.
          ls_row-state = 'Warning'.
          ls_row-icon  = 'sap-icon://alert'.
        WHEN 'S'.
          ls_row-state = 'Success'.
          ls_row-icon  = 'sap-icon://sys-enter-2'.
        WHEN OTHERS.
          ls_row-state = 'Information'.
          ls_row-icon  = 'sap-icon://information'.
      ENDCASE.
      INSERT ls_row INTO TABLE result->mt_messages.
    ENDLOOP.
  ENDMETHOD.

  METHOD factory_messages.
    result = NEW #( ).
    result->mv_title    = title.
    result->mt_messages = t_messages.
    IF result->mv_title IS INITIAL.
      result->mv_title = 'Messages'.
    ENDIF.
  ENDMETHOD.

  METHOD z2fiori_if_app~main.
    IF client->get( )-event = 'CLOSE'.
      client->popup_close( ).
      client->nav_leave( ).
      RETURN.
    ENDIF.

    IF client->check_init( ) = abap_true.
      DATA(view) = z2fiori_cl_xml_view_builder=>factory( ).

      view->dialog( title = mv_title content_width = '700px' content_height = '400px'
        )->table( items = client->bind( mt_messages )
          )->columns(
            )->column( width = '100px' )->header( )->text( 'Status' )->end( )->end(
            )->column( )->header( )->text( 'Message' )->end( )->end(
            )->column( width = '120px' )->header( )->text( 'Code' )->end( )->end(
          )->items(
            )->column_list_item(
              )->cells(
                )->object_status( text = '{TYPE}' state = '{STATE}' icon = '{ICON}'
                )->text( '{MESSAGE}'
                )->text( '{ID} {NUMBER}'
              )->end(
            )->end(
        )->begin_button(
          )->button( text = 'Close' press = client->event( 'CLOSE' ) type = 'Emphasized'
        )->end( ).

      client->popup_show( view->stringify( ) ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
