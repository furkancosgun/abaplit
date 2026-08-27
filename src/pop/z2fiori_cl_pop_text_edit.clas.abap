CLASS z2fiori_cl_pop_text_edit DEFINITION
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
        value           TYPE string,
        check_confirmed TYPE abap_bool,
      END OF ty_s_result.

    DATA mv_title       TYPE string.
    DATA mv_value       TYPE string.
    DATA mv_placeholder TYPE string.
    DATA mv_rows        TYPE i VALUE 8.
    DATA mv_editable    TYPE abap_bool VALUE abap_true.
    DATA ms_result      TYPE ty_s_result.

    CLASS-METHODS factory
      IMPORTING
        title         TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        placeholder   TYPE clike OPTIONAL
        rows          TYPE i DEFAULT 8
        editable      TYPE abap_bool DEFAULT abap_true
      RETURNING
        VALUE(result) TYPE REF TO z2fiori_cl_pop_text_edit.

    CLASS-METHODS get_result
      IMPORTING
        client        TYPE REF TO z2fiori_if_client
      RETURNING
        VALUE(result) TYPE ty_s_result.

ENDCLASS.


CLASS z2fiori_cl_pop_text_edit IMPLEMENTATION.
  METHOD factory.
    result = NEW #( ).
    result->mv_title       = title.
    result->mv_value       = value.
    result->mv_placeholder = placeholder.
    result->mv_rows        = rows.
    result->mv_editable    = editable.
    IF result->mv_title IS INITIAL.
      result->mv_title = 'Text Editor'.
    ENDIF.
  ENDMETHOD.

  METHOD get_result.
    client->get_nav_prev_arg( IMPORTING result = result ).
  ENDMETHOD.

  METHOD z2fiori_if_app~main.
    CASE client->get( )-event.
      WHEN 'OK'.
        ms_result-action          = cs_action-ok.
        ms_result-value           = mv_value.
        ms_result-check_confirmed = abap_true.
        client->popup_close( ).
        client->nav_leave( ms_result ).
        RETURN.

      WHEN 'CANCEL'.
        ms_result-action          = cs_action-cancel.
        ms_result-value           = mv_value.
        ms_result-check_confirmed = abap_false.
        client->popup_close( ).
        client->nav_leave( ms_result ).
        RETURN.
    ENDCASE.

    IF client->check_init( ) = abap_true.
      DATA(view) = z2fiori_cl_xml_view_builder=>factory( ).

      view->dialog( title = mv_title content_width = '600px'
        )->vbox( class = 'sapUiMediumMargin'
          )->text_area(
            value       = client->bind( mv_value )
            placeholder = client->bind( mv_placeholder )
            rows        = |{ mv_rows }|
            width       = '100%'
            editable    = |{ mv_editable }|
            growing     = 'true'
        )->end(
        )->begin_button(
          )->button( text = 'OK' press = client->event( 'OK' ) type = 'Emphasized'
        )->end(
        )->end_button(
          )->button( text = 'Cancel' press = client->event( 'CANCEL' )
        )->end( ).

      client->popup_show( view->stringify( ) ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
