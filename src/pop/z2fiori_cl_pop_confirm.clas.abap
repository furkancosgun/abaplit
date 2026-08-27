CLASS z2fiori_cl_pop_confirm DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    CONSTANTS:
      BEGIN OF cs_action,
        ok     TYPE string VALUE 'OK',
        cancel TYPE string VALUE 'CANCEL',
      END OF cs_action.

    TYPES:
      BEGIN OF ty_s_result,
        action          TYPE string,
        check_confirmed TYPE abap_bool,
      END OF ty_s_result.

    DATA mv_title              TYPE string.
    DATA mv_text               TYPE string.
    DATA mv_icon               TYPE string.
    DATA mv_button_text_ok     TYPE string VALUE 'OK'.
    DATA mv_button_text_cancel TYPE string VALUE 'Cancel'.
    DATA ms_result             TYPE ty_s_result.

    CLASS-METHODS factory
      IMPORTING
        title              TYPE clike OPTIONAL
        text               TYPE clike
        icon               TYPE clike OPTIONAL
        button_text_ok     TYPE clike DEFAULT 'OK'
        button_text_cancel TYPE clike DEFAULT 'Cancel'
      RETURNING
        VALUE(result)      TYPE REF TO z2fiori_cl_pop_confirm.

    CLASS-METHODS get_result
      IMPORTING
        client        TYPE REF TO z2fiori_if_client
      RETURNING
        VALUE(result) TYPE ty_s_result.

ENDCLASS.


CLASS z2fiori_cl_pop_confirm IMPLEMENTATION.
  METHOD factory.
    result = NEW #( ).
    result->mv_title              = title.
    result->mv_text               = text.
    result->mv_icon               = icon.
    result->mv_button_text_ok     = button_text_ok.
    result->mv_button_text_cancel = button_text_cancel.
    IF result->mv_title IS INITIAL.
      result->mv_title = 'Confirmation'.
    ENDIF.
  ENDMETHOD.

  METHOD get_result.
    client->get_nav_prev_arg( IMPORTING result = result ).
  ENDMETHOD.

  METHOD z2fiori_if_app~main.
    CASE client->get( )-event.
      WHEN 'OK'.
        ms_result-action          = cs_action-ok.
        ms_result-check_confirmed = abap_true.
        client->popup_close( ).
        client->nav_leave( ms_result ).
        RETURN.

      WHEN 'CANCEL'.
        ms_result-action          = cs_action-cancel.
        ms_result-check_confirmed = abap_false.
        client->popup_close( ).
        client->nav_leave( ms_result ).
        RETURN.
    ENDCASE.

    IF client->check_init( ) = abap_true.
      DATA(view) = z2fiori_cl_xml_view_builder=>factory( ).

      view->dialog( title = mv_title icon = mv_icon content_width = '400px'
        )->vbox( class = 'sapUiMediumMargin'
          )->text( client->bind( mv_text )
        )->end(
        )->begin_button(
          )->button( text = client->bind( mv_button_text_ok ) press = client->event( 'OK' ) type = 'Emphasized'
        )->end(
        )->end_button(
          )->button( text = client->bind( mv_button_text_cancel ) press = client->event( 'CANCEL' )
        )->end( ).

      client->popup_show( view->stringify( ) ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
