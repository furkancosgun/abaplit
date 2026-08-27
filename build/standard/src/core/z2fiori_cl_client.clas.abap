CLASS z2fiori_cl_client DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_client.

    METHODS constructor
      IMPORTING app TYPE REF TO object
                req TYPE z2fiori_if_types=>ty_s_http_req OPTIONAL.

  PRIVATE SECTION.
    DATA mo_app     TYPE REF TO object.
    DATA ms_req     TYPE z2fiori_if_types=>ty_s_http_req.
    DATA mv_view    TYPE string.
    DATA mo_actions TYPE REF TO lcl_action_mgr.
    DATA mo_binder  TYPE REF TO lcl_binding_resolver.
ENDCLASS.


CLASS z2fiori_cl_client IMPLEMENTATION.
  METHOD constructor.
    mo_app     = app.
    ms_req     = req.
    CREATE OBJECT mo_actions.
    CREATE OBJECT mo_binder EXPORTING IO_APP = app.
  ENDMETHOD.

  METHOD z2fiori_if_client~get_view.
    result = mv_view.
  ENDMETHOD.

  METHOD z2fiori_if_client~get_actions.
    result = mo_actions->get_actions( ).
  ENDMETHOD.

  METHOD z2fiori_if_client~view_display.
    mv_view = xml.
  ENDMETHOD.

  METHOD z2fiori_if_client~popup_show.
    mo_actions->popup_show( xml ).
  ENDMETHOD.

  METHOD z2fiori_if_client~popup_close.
    mo_actions->popup_close( ).
  ENDMETHOD.

  METHOD z2fiori_if_client~popups_close_all.
    mo_actions->popups_close_all( ).
  ENDMETHOD.

  METHOD z2fiori_if_client~nest_view_display.
    mo_actions->nest_view_display( id            = id
                                   xml           = xml
                                   method_insert = method_insert ).
  ENDMETHOD.

  METHOD z2fiori_if_client~nest_view_destroy.
    mo_actions->nest_view_destroy( id             = id
                                   method_destroy = method_destroy ).
  ENDMETHOD.

  METHOD z2fiori_if_client~toast_display.
    mo_actions->toast_display( text     = text
                               duration = duration ).
  ENDMETHOD.

  METHOD z2fiori_if_client~message_box_display.
    mo_actions->message_box_display( text          = text
                                     title         = title
                                     type          = type
                                     confirm_event = confirm_event
                                     cancel_event  = cancel_event ).
  ENDMETHOD.

  METHOD z2fiori_if_client~set_title.
    mo_actions->set_title( title ).
  ENDMETHOD.

  METHOD z2fiori_if_client~set_favicon.
    mo_actions->set_favicon( url ).
  ENDMETHOD.

  METHOD z2fiori_if_client~set_focus.
    mo_actions->set_focus( id ).
  ENDMETHOD.

  METHOD z2fiori_if_client~scroll_into_view.
    mo_actions->scroll_into_view( id ).
  ENDMETHOD.

  METHOD z2fiori_if_client~clipboard_write.
    mo_actions->clipboard_write( text ).
  ENDMETHOD.

  METHOD z2fiori_if_client~clipboard_read.
    mo_actions->clipboard_read( event ).
  ENDMETHOD.

  METHOD z2fiori_if_client~device_read.
    mo_actions->device_read( event ).
  ENDMETHOD.

  METHOD z2fiori_if_client~location_read.
    mo_actions->location_read( event ).
  ENDMETHOD.

  METHOD z2fiori_if_client~query_read.
    mo_actions->query_read( event ).
  ENDMETHOD.

  METHOD z2fiori_if_client~open_new_tab.
    mo_actions->open_new_tab( url ).
  ENDMETHOD.

  METHOD z2fiori_if_client~location_reload.
    mo_actions->location_reload( ).
  ENDMETHOD.

  METHOD z2fiori_if_client~set_dirty_state.
    mo_actions->set_dirty_state( is_dirty ).
  ENDMETHOD.

  METHOD z2fiori_if_client~keyboard_shortcut.
    mo_actions->keyboard_shortcut( key        = key
                                   ctrl       = ctrl
                                   alt        = alt
                                   shift      = shift
                                   event      = event
                                   event_args = event_args ).
  ENDMETHOD.

  METHOD z2fiori_if_client~add_script.
    mo_actions->add_script( url ).
  ENDMETHOD.

  METHOD z2fiori_if_client~add_style.
    mo_actions->add_style( url ).
  ENDMETHOD.

  METHOD z2fiori_if_client~file_download.
    mo_actions->file_download( filename = filename
                               base64   = base64
                               type     = type ).
  ENDMETHOD.

  METHOD z2fiori_if_client~follow_up_action.
    mo_actions->follow_up_action( event      = event
                                  event_args = event_args
                                  delay_ms   = delay_ms ).
  ENDMETHOD.

  METHOD z2fiori_if_client~nav_call.
    mo_actions->nav_call( app ).
  ENDMETHOD.

  METHOD z2fiori_if_client~nav_leave.
    mo_actions->nav_leave( result ).
  ENDMETHOD.

  METHOD z2fiori_if_client~get_nav_prev_arg.
    lcl_request_reader=>get_nav_prev_arg( EXPORTING iv_nav_prev_arg = ms_req-nav_prev_arg
                                          IMPORTING result          = result ).
  ENDMETHOD.

  METHOD z2fiori_if_client~get.
    result = ms_req.
    TRY.
        z2fiori_if_client~get_nav_prev_arg( IMPORTING result = result-nav_prev_arg ).
      CATCH z2fiori_cx_error.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_client~get_event.
    result = ms_req-event.
  ENDMETHOD.

  METHOD z2fiori_if_client~get_event_arg.
    READ TABLE ms_req-event_args INTO result INDEX index.
    IF sy-subrc <> 0.
      CLEAR result.
    ENDIF.
  ENDMETHOD.

  METHOD z2fiori_if_client~get_query_param.
    DATA lt_query TYPE z2fiori_if_types=>ty_t_query.
    lt_query = z2fiori_if_client~get_query( index ).
    result = lcl_request_reader=>find_query_param( it_query = lt_query
                                                   name     = name ).
  ENDMETHOD.

  METHOD z2fiori_if_client~get_query.
    DATA lv_arg TYPE string.
    lv_arg = z2fiori_if_client~get_event_arg( index ).
    result = lcl_request_reader=>get_query( lv_arg ).
  ENDMETHOD.

  METHOD z2fiori_if_client~get_config.
    DATA lv_arg TYPE string.
    lv_arg = z2fiori_if_client~get_event_arg( index ).
    result = lcl_request_reader=>get_config( lv_arg ).
  ENDMETHOD.

  METHOD z2fiori_if_client~get_device.
    DATA lv_arg TYPE string.
    lv_arg = z2fiori_if_client~get_event_arg( index ).
    result = lcl_request_reader=>get_device( lv_arg ).
  ENDMETHOD.

  METHOD z2fiori_if_client~check_init.
    result = ms_req-check_init.
  ENDMETHOD.

  METHOD z2fiori_if_client~check_navigated.
    result = ms_req-check_navigated.
  ENDMETHOD.

  METHOD z2fiori_if_client~check_nav_stack.
    result = ms_req-check_nav_stack.
  ENDMETHOD.

  METHOD z2fiori_if_client~check_event.
      DATA temp1 TYPE xsdboolean.
      DATA temp2 TYPE xsdboolean.
    IF event IS INITIAL.
      
      temp1 = boolc( ms_req-event IS NOT INITIAL ).
      result = temp1.
    ELSE.
      
      temp2 = boolc( ms_req-event = event ).
      result = temp2.
    ENDIF.
  ENDMETHOD.

  METHOD z2fiori_if_client~event.
    result = lcl_event_helper=>event( event = event
                                      t_arg = t_arg ).
  ENDMETHOD.

  METHOD z2fiori_if_client~bind.
    result = mo_binder->bind( val ).
  ENDMETHOD.
ENDCLASS.
