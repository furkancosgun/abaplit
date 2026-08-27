CLASS z2fiori_cl_pop_table DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    CONSTANTS:
      BEGIN OF cs_action,
        select TYPE string VALUE 'SELECT',
        cancel TYPE string VALUE 'CANCEL',
      END OF cs_action.

    TYPES:
      BEGIN OF ty_s_row,
        key        TYPE string,
        title      TYPE string,
        descr      TYPE string,
        info       TYPE string,
        info_state TYPE string,
      END OF ty_s_row,
      ty_t_row TYPE STANDARD TABLE OF ty_s_row WITH EMPTY KEY.

    TYPES:
      BEGIN OF ty_s_result,
        action          TYPE string,
        selected_key    TYPE string,
        selected_row    TYPE ty_s_row,
        check_confirmed TYPE abap_bool,
      END OF ty_s_result.

    DATA mv_title      TYPE string.
    DATA mv_search     TYPE string.
    DATA mt_rows       TYPE ty_t_row.
    DATA mt_rows_disp  TYPE ty_t_row.
    DATA ms_result     TYPE ty_s_result.

    CLASS-METHODS factory
      IMPORTING
        title         TYPE clike OPTIONAL
        t_rows        TYPE ty_t_row
        search_value  TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO z2fiori_cl_pop_table.

    CLASS-METHODS get_result
      IMPORTING
        client        TYPE REF TO z2fiori_if_client
      RETURNING
        VALUE(result) TYPE ty_s_result.

  PRIVATE SECTION.
    METHODS filter_rows.
ENDCLASS.


CLASS z2fiori_cl_pop_table IMPLEMENTATION.
  METHOD factory.
    result = NEW #( ).
    result->mv_title  = title.
    result->mt_rows   = t_rows.
    result->mv_search = search_value.
    IF result->mv_title IS INITIAL.
      result->mv_title = 'Select Item'.
    ENDIF.
    result->filter_rows( ).
  ENDMETHOD.

  METHOD get_result.
    client->get_nav_prev_arg( IMPORTING result = result ).
  ENDMETHOD.

  METHOD filter_rows.
    DATA lv_query TYPE string.
    DATA ls_row   TYPE ty_s_row.

    CLEAR mt_rows_disp.
    IF mv_search IS INITIAL.
      mt_rows_disp = mt_rows.
      RETURN.
    ENDIF.

    lv_query = to_upper( mv_search ).
    LOOP AT mt_rows INTO ls_row.
      IF to_upper( ls_row-key ) CS lv_query OR
         to_upper( ls_row-title ) CS lv_query OR
         to_upper( ls_row-descr ) CS lv_query OR
         to_upper( ls_row-info ) CS lv_query.
        INSERT ls_row INTO TABLE mt_rows_disp.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD z2fiori_if_app~main.
    CASE client->get( )-event.
      WHEN 'SEARCH'.
        filter_rows( ).
        client->popup_show( client->get_view( ) ).
        RETURN.

      WHEN 'SELECT'.
        DATA(lv_key) = client->get_event_arg( 1 ).
        READ TABLE mt_rows WITH KEY key = lv_key INTO DATA(ls_selected).
        IF sy-subrc = 0.
          ms_result-action          = cs_action-select.
          ms_result-selected_key    = ls_selected-key.
          ms_result-selected_row    = ls_selected.
          ms_result-check_confirmed = abap_true.
          client->popup_close( ).
          client->nav_leave( ms_result ).
          RETURN.
        ENDIF.

      WHEN 'CANCEL'.
        ms_result-action          = cs_action-cancel.
        ms_result-check_confirmed = abap_false.
        client->popup_close( ).
        client->nav_leave( ms_result ).
        RETURN.
    ENDCASE.

    IF client->check_init( ) = abap_true.
      DATA(view) = z2fiori_cl_xml_view_builder=>factory( ).

      view->dialog( title = mv_title content_width = '600px' content_height = '450px'
        )->vbox(
          )->search_field(
            value       = client->bind( mv_search )
            search      = client->event( 'SEARCH' )
            live_change = client->event( 'SEARCH' )
            width       = '100%'
          )->list(
            items = client->bind( mt_rows_disp )
            mode  = 'SingleSelectMaster'
          )->standard_list_item(
            title       = '{TITLE}'
            description = '{DESCR}'
            info        = '{INFO}'
            info_state  = '{INFO_STATE}'
            press       = client->event( event = 'SELECT' t_arg = VALUE #( ( `{KEY}` ) ) )
            type        = 'Active'
        )->end(
        )->begin_button(
          )->button( text = 'Cancel' press = client->event( 'CANCEL' )
        )->end( ).

      client->popup_show( view->stringify( ) ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
