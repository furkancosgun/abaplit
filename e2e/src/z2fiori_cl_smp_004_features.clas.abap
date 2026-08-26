CLASS z2fiori_cl_smp_004_features DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_title_input     TYPE string VALUE `New Custom Title`.
    DATA mv_msg_result      TYPE string VALUE `No message box response yet`.
    DATA mv_clipboard_text  TYPE string VALUE `Hello Clipboard`.
    DATA mv_clipboard_read  TYPE string VALUE `Nothing read yet`.
    DATA mv_shortcut_status TYPE string VALUE `No shortcut triggered`.
    DATA mv_followup_status TYPE string VALUE `No followup yet`.
    DATA mv_dirty_status    TYPE string VALUE `Clean`.
    DATA mv_device_info     TYPE string VALUE ``.
    DATA mv_param_val       TYPE string VALUE ``.

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS z2fiori_cl_smp_004_features IMPLEMENTATION.

  METHOD z2fiori_if_app~main.
    DATA lo_view TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_page TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_vbox TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_nest TYPE REF TO z2fiori_cl_view_builder.
    DATA ls_dev  TYPE z2fiori_if_types=>ty_s_device.

    IF client->check_init( ).
      client->device_read( `DEVICE_INFO_RESULT` ).
      client->query_read( `QUERY_RESULT` ).

      client->keyboard_shortcut(
        key   = 'k'
        ctrl  = abap_true
        event = 'SHORTCUT_TRIGGERED' ).

      lo_view = z2fiori_cl_view_builder=>factory(
        )->ele( n = `View` ns = `mvc`
          )->a( n = `displayBlock` v = `true`
          )->a( n = `height`       v = `100%`
          )->a( n = `xmlns`        v = `sap.m`
          )->a( n = `xmlns:mvc`    v = `sap.ui.core.mvc` ).

      lo_page = lo_view->ele( `Page`
        )->a( n = `id`    v = `pageFeatures`
        )->a( n = `title` v = `Sample 004 - Client Features Suite` ).

      lo_vbox = lo_page->ele( `VBox` )->a( n = `id` v = `vboxFeatures` )->a( n = `class` v = `sapUiMediumMargin` ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtMsgResult`
        )->a( n = `text` v = client->bind( mv_msg_result ) ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtShortcutStatus`
        )->a( n = `text` v = client->bind( mv_shortcut_status ) ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtFollowupStatus`
        )->a( n = `text` v = client->bind( mv_followup_status ) ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtClipboardRead`
        )->a( n = `text` v = client->bind( mv_clipboard_read ) ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtDirtyStatus`
        )->a( n = `text` v = client->bind( mv_dirty_status ) ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtDeviceInfo`
        )->a( n = `text` v = client->bind( mv_device_info ) ).

      lo_vbox->ele( `Input`
        )->a( n = `id`    v = `inpTitle`
        )->a( n = `value` v = client->bind( mv_title_input ) ).

      lo_vbox->ele( `Input`
        )->a( n = `id`    v = `inpFocusTarget`
        )->a( n = `placeholder` v = `Target for Focus` ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnSetTitle`
        )->a( n = `text`  v = `Set Title & Favicon`
        )->a( n = `press` v = client->event( `SET_TITLE_FAVICON` ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnFocus`
        )->a( n = `text`  v = `Focus Input`
        )->a( n = `press` v = client->event( `DO_FOCUS` ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnMsgBox`
        )->a( n = `text`  v = `Show Message Box`
        )->a( n = `press` v = client->event( `SHOW_MSG_BOX` ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnClipboardWrite`
        )->a( n = `text`  v = `Write Clipboard`
        )->a( n = `press` v = client->event( `CLIP_WRITE` ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnClipboardRead`
        )->a( n = `text`  v = `Read Clipboard`
        )->a( n = `press` v = client->event( `CLIP_READ` ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnDirty`
        )->a( n = `text`  v = `Set Dirty`
        )->a( n = `press` v = client->event( `SET_DIRTY` ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnFollowup`
        )->a( n = `text`  v = `Trigger Followup`
        )->a( n = `press` v = client->event( `TRIGGER_FOLLOWUP` ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnNestDisplay`
        )->a( n = `text`  v = `Mount Nested View`
        )->a( n = `press` v = client->event( `NEST_DISPLAY` ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnNestDestroy`
        )->a( n = `text`  v = `Destroy Nested View`
        )->a( n = `press` v = client->event( `NEST_DESTROY` ) ).

      lo_vbox->ele( `Panel`
        )->a( n = `id` v = `panelNested`
        )->a( n = `headerText` v = `Nested View Target Container` ).

      client->view_display( lo_view->stringify( ) ).

    ELSEIF client->check_event( ).

      CASE client->get_event( ).
        WHEN `SET_TITLE_FAVICON`.
          client->set_title( mv_title_input ).
          client->set_favicon( `https://sap.github.io/ui5-webcomponents/assets/favicon.ico` ).
          client->toast_display( `Title and favicon updated` ).

        WHEN `DO_FOCUS`.
          client->set_focus( `inpFocusTarget` ).

        WHEN `SHOW_MSG_BOX`.
          client->message_box_display(
            text          = `Are you sure you want to proceed?`
            title         = `Confirmation Dialog`
            confirm_event = `MSG_CONFIRMED`
            cancel_event  = `MSG_CANCELLED` ).

        WHEN `MSG_CONFIRMED`.
          mv_msg_result = `Confirmed by user`.

        WHEN `MSG_CANCELLED`.
          mv_msg_result = `Cancelled by user`.

        WHEN `CLIP_WRITE`.
          client->clipboard_write( mv_clipboard_text ).
          client->toast_display( `Copied to clipboard` ).

        WHEN `CLIP_READ`.
          client->clipboard_read( `CLIP_READ_RESULT` ).

        WHEN `CLIP_READ_RESULT`.
          mv_clipboard_read = |Read: { client->get_event_arg( 1 ) }|.

        WHEN `SHORTCUT_TRIGGERED`.
          mv_shortcut_status = `Ctrl+K was pressed`.

        WHEN `SET_DIRTY`.
          client->set_dirty_state( abap_true ).
          mv_dirty_status = `Dirty`.

        WHEN `TRIGGER_FOLLOWUP`.
          mv_followup_status = `Followup initiated`.
          client->follow_up_action(
            event    = `FOLLOWUP_COMPLETED`
            delay_ms = 50 ).

        WHEN `FOLLOWUP_COMPLETED`.
          mv_followup_status = `Followup executed successfully`.

        WHEN `NEST_DISPLAY`.
          lo_nest = z2fiori_cl_view_builder=>factory(
            )->ele( n = `View` ns = `mvc`
              )->a( n = `xmlns`     v = `sap.m`
              )->a( n = `xmlns:mvc` v = `sap.ui.core.mvc`
              )->ele( `Text`
              )->a( n = `id`   v = `txtNestedChild`
              )->a( n = `text` v = `I am a nested view content` ).

          client->nest_view_display(
            id            = `panelNested`
            xml           = lo_nest->stringify( )
            method_insert = `addContent` ).

        WHEN `NEST_DESTROY`.
          client->nest_view_destroy(
            id             = `panelNested`
            method_destroy = `destroyContent` ).

        WHEN `DEVICE_INFO_RESULT`.
          ls_dev = client->get_device( ).
          mv_device_info = |System: { ls_dev-system }, OS: { ls_dev-os-name }|.

        WHEN `QUERY_RESULT`.
          mv_param_val = client->get_query_param( 'test_param' ).

      ENDCASE.

    ENDIF.

  ENDMETHOD.

ENDCLASS.