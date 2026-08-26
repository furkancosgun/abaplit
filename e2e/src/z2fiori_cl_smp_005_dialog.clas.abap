CLASS z2fiori_cl_smp_005_dialog DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_user_name  TYPE string VALUE `John Doe`.
    DATA mv_user_email TYPE string VALUE `john.doe@example.com`.
    DATA mv_user_dept  TYPE string VALUE `SAP Fiori Core`.
    DATA mv_status     TYPE string VALUE `No action performed yet`.

ENDCLASS.

CLASS z2fiori_cl_smp_005_dialog IMPLEMENTATION.

  METHOD z2fiori_if_app~main.
    DATA lo_view  TYPE REF TO z2fiori_cl_xml_view_builder.
    DATA lo_popup TYPE REF TO z2fiori_cl_xml_view_builder.

    IF client->check_init( ).

      lo_view = z2fiori_cl_xml_view_builder=>factory( ).
      lo_view->page( id = `pageMain` title = `Sample 005 - Form & Dialog Popup`
        )->vbox( class = `sapUiMediumMargin`
          )->title( `User Profile Card`
          )->label( `Full Name:`
          )->text( id = `txtDisplayUser` text = client->bind( mv_user_name )
          )->label( `Email:`
          )->text( id = `txtDisplayEmail` text = client->bind( mv_user_email )
          )->label( `Department:`
          )->text( id = `txtDisplayDept` text = client->bind( mv_user_dept )
          )->label( `Status:`
          )->text( id = `txtStatus` text = client->bind( mv_status )
          )->button( id = `btnOpenDialog` text = `Edit Profile (Popup)` press = client->event( `OPEN_DIALOG` )
          )->button( id = `btnReset` text = `Reset to Default` press = client->event( `RESET_DATA` ) ).

      client->view_display( lo_view->stringify( ) ).

    ELSEIF client->check_event( ).

      CASE client->get_event( ).
        WHEN `OPEN_DIALOG`.
          mv_status = `Edit dialog is open`.

          lo_popup = z2fiori_cl_xml_view_builder=>factory_popup( ).
          lo_popup->dialog( id = `dlgProfile` title = `Edit Profile`
            )->vbox( class = `sapUiMediumMargin`
              )->label( `Full Name`
              )->input( id = `inpName` value = client->bind( mv_user_name )
              )->label( `Email`
              )->input( id = `inpEmail` value = client->bind( mv_user_email )
              )->label( `Department`
              )->input( id = `inpDept` value = client->bind( mv_user_dept )
              )->button( id = `btnSaveInPopup` text = `Save and Close` press = client->event( `SAVE_POPUP` )
              )->button( id = `btnCancelInPopup` text = `Cancel` press = client->event( `CANCEL_POPUP` ) ).

          client->popup_show( lo_popup->stringify( ) ).

        WHEN `SAVE_POPUP`.
          mv_status = |Profile updated: { mv_user_name } - { mv_user_dept }|.
          client->toast_display( `Profile updated successfully` ).
          client->popup_close( ).

        WHEN `CANCEL_POPUP`.
          mv_status = `Edit cancelled`.
          client->popup_close( ).

        WHEN `RESET_DATA`.
          mv_user_name  = `John Doe`.
          mv_user_email = `john.doe@example.com`.
          mv_user_dept  = `SAP Fiori Core`.
          mv_status     = `Data reset to default`.
          client->toast_display( `Reset to default data` ).

      ENDCASE.

    ENDIF.

  ENDMETHOD.

ENDCLASS.
