CLASS z2fiori_cl_demo_002 DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_last_action TYPE string VALUE 'None'.
ENDCLASS.


CLASS z2fiori_cl_demo_002 IMPLEMENTATION.
  METHOD z2fiori_if_app~main.
    DATA ls_confirm   TYPE z2fiori_cl_pop_confirm=>ty_s_result.
    DATA ls_input     TYPE z2fiori_cl_pop_input=>ty_s_result.
    DATA ls_text_edit TYPE z2fiori_cl_pop_text_edit=>ty_s_result.
    DATA ls_table     TYPE z2fiori_cl_pop_table=>ty_s_result.
    DATA lt_users     TYPE z2fiori_cl_pop_table=>ty_t_row.
    DATA lt_msgs      TYPE z2fiori_cl_pop_messages=>ty_t_msg_entry.

    IF client->check_navigated( ) = abap_true.
      ls_confirm = z2fiori_cl_pop_confirm=>get_result( client ).
      IF ls_confirm-action IS NOT INITIAL.
        mv_last_action = |Confirm Popup -> Action: { ls_confirm-action }, Confirmed: { ls_confirm-check_confirmed }|.
        client->toast_display( mv_last_action ).
      ENDIF.

      ls_input = z2fiori_cl_pop_input=>get_result( client ).
      IF ls_input-action IS NOT INITIAL.
        mv_last_action = |Input Popup -> Value: { ls_input-value }|.
        client->toast_display( mv_last_action ).
      ENDIF.

      ls_text_edit = z2fiori_cl_pop_text_edit=>get_result( client ).
      IF ls_text_edit-action IS NOT INITIAL.
        mv_last_action = |Text Edit -> Value: { ls_text_edit-value }|.
        client->toast_display( mv_last_action ).
      ENDIF.

      ls_table = z2fiori_cl_pop_table=>get_result( client ).
      IF ls_table-action IS NOT INITIAL.
        mv_last_action = |Table Selected -> Key: { ls_table-selected_key }, Title: { ls_table-selected_row-title }|.
        client->toast_display( mv_last_action ).
      ENDIF.
    ENDIF.

    CASE client->get( )-event.
      WHEN 'POP_CONFIRM'.
        client->nav_call( z2fiori_cl_pop_confirm=>factory(
          title = 'Delete Confirmation'
          text  = 'Are you sure you want to delete this record?'
          icon  = 'sap-icon://question-mark'
        ) ).
        RETURN.

      WHEN 'POP_INPUT'.
        client->nav_call( z2fiori_cl_pop_input=>factory(
          title       = 'Create Entry'
          label       = 'Username'
          placeholder = 'Enter new username...'
        ) ).
        RETURN.

      WHEN 'POP_TEXT_EDIT'.
        client->nav_call( z2fiori_cl_pop_text_edit=>factory(
          title = 'Edit Notes'
          value = |Line 1: Note content\nLine 2: Additional details|
        ) ).
        RETURN.

      WHEN 'POP_TABLE'.
        lt_users = VALUE #(
          ( key = 'USER_01' title = 'Furkan Cosgun' descr = 'Lead Architect' info = 'Active' info_state = 'Success' )
          ( key = 'USER_02' title = 'Alex Mueller' descr = 'Senior Developer' info = 'Active' info_state = 'Success' )
          ( key = 'USER_03' title = 'Sarah Jenkins' descr = 'Product Manager' info = 'Away' info_state = 'Warning' )
        ).
        client->nav_call( z2fiori_cl_pop_table=>factory(
          title  = 'Select User'
          t_rows = lt_users
        ) ).
        RETURN.

      WHEN 'POP_MESSAGES'.
        lt_msgs = VALUE #(
          ( type = 'S' state = 'Success' icon = 'sap-icon://sys-enter-2' message = 'Sales order 4500012 created.' id = 'V1' number = '311' )
          ( type = 'W' state = 'Warning' icon = 'sap-icon://alert' message = 'Material stock level is low.' id = 'M3' number = '018' )
          ( type = 'E' state = 'Error' icon = 'sap-icon://error' message = 'Credit check failed for customer 1002.' id = 'V4' number = '109' )
        ).
        client->nav_call( z2fiori_cl_pop_messages=>factory_messages(
          title      = 'Validation Log'
          t_messages = lt_msgs
        ) ).
        RETURN.

      WHEN 'POP_PDF'.
        client->nav_call( z2fiori_cl_pop_pdf=>factory(
          title    = 'Invoice Preview'
          filename = 'invoice_2026.pdf'
          base64   = 'JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDw...'
        ) ).
        RETURN.
    ENDCASE.

    IF client->check_init( ) = abap_true.
      DATA(view) = z2fiori_cl_xml_view_builder=>factory( ).

      view->page( 'abap2fiori - Demo 002 (Popups)'
        )->simple_form( 'Built-in Popups Showcase'
          )->label( 'Last Result'
          )->text( client->bind( mv_last_action )
          )->label( 'Confirmation'
          )->button( text = 'Open Confirm Popup' press = client->event( 'POP_CONFIRM' ) type = 'Emphasized'
          )->label( 'Input Value'
          )->button( text = 'Open Input Popup' press = client->event( 'POP_INPUT' )
          )->label( 'Multi-line Text'
          )->button( text = 'Open Text Editor' press = client->event( 'POP_TEXT_EDIT' )
          )->label( 'Table / Value Help'
          )->button( text = 'Open Table Selection (F4)' press = client->event( 'POP_TABLE' )
          )->label( 'Messages & Logs'
          )->button( text = 'Open Messages Dialog' press = client->event( 'POP_MESSAGES' )
          )->label( 'PDF & Files'
          )->button( text = 'Open PDF Dialog' press = client->event( 'POP_PDF' )
      ).

      client->view_display( view->stringify( ) ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
