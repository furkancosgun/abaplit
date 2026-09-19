CLASS zcl_abaplit_client DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_client.

    METHODS constructor
      IMPORTING app TYPE REF TO object
                req TYPE zif_abaplit_types=>ty_s_http_req OPTIONAL.

  PRIVATE SECTION.
    DATA mo_app     TYPE REF TO object.
    DATA ms_req     TYPE zif_abaplit_types=>ty_s_http_req.
    DATA mv_view    TYPE string.
    DATA mo_actions TYPE REF TO lcl_action_mgr.
    DATA mo_binder  TYPE REF TO lcl_binding_resolver.
ENDCLASS.


CLASS zcl_abaplit_client IMPLEMENTATION.

  METHOD constructor.
    mo_app     = app.
    ms_req     = req.
    mo_actions = NEW #( ).
    mo_binder  = NEW #( app ).
  ENDMETHOD.

  METHOD zif_abaplit_client~new_view.
    result = zcl_abaplit_view_builder=>factory( ).
  ENDMETHOD.

  METHOD zif_abaplit_client~view_display.
    mv_view = val.
  ENDMETHOD.

  METHOD zif_abaplit_client~get_view.
    result = mv_view.
  ENDMETHOD.

  METHOD zif_abaplit_client~bind.
    result = mo_binder->bind( val ).
  ENDMETHOD.

  METHOD zif_abaplit_client~event.
    result = lcl_event_helper=>event( event = event
                                      t_arg = t_arg ).
  ENDMETHOD.

  METHOD zif_abaplit_client~check_event.
    DATA lv_clean TYPE string.
    lv_clean = ms_req-event.
    IF lv_clean CP 'onEvent(''*'')'.
      DATA(lv_len) = strlen( lv_clean ) - 10.
      IF lv_len > 0.
        lv_clean = substring( val = lv_clean off = 9 len = lv_len ).
      ENDIF.
    ENDIF.

    IF event IS INITIAL.
      result = xsdbool( ms_req-event IS NOT INITIAL ).
    ELSE.
      result = xsdbool( ms_req-event = event OR lv_clean = event ).
    ENDIF.
  ENDMETHOD.

  METHOD zif_abaplit_client~check_init.
    result = ms_req-check_init.
  ENDMETHOD.

  METHOD zif_abaplit_client~get_event.
    result = ms_req-event.
  ENDMETHOD.

  METHOD zif_abaplit_client~get_event_arg.
    READ TABLE ms_req-event_args INTO result INDEX index.
    IF sy-subrc <> 0.
      CLEAR result.
    ENDIF.
  ENDMETHOD.

  METHOD zif_abaplit_client~toast_display.
    mo_actions->toast_display( text     = text
                               duration = duration ).
  ENDMETHOD.

  METHOD zif_abaplit_client~file_download.
    mo_actions->file_download( filename = filename
                               base64   = base64
                               type     = type ).
  ENDMETHOD.

  METHOD zif_abaplit_client~clipboard_write.
    mo_actions->clipboard_write( text ).
  ENDMETHOD.

  METHOD zif_abaplit_client~open_new_tab.
    mo_actions->open_new_tab( url ).
  ENDMETHOD.

  METHOD zif_abaplit_client~set_title.
    mo_actions->set_title( title ).
  ENDMETHOD.

  METHOD zif_abaplit_client~get.
    result = ms_req.
  ENDMETHOD.

  METHOD zif_abaplit_client~get_actions.
    result = mo_actions->get_actions( ).
  ENDMETHOD.

ENDCLASS.
