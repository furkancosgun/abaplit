CLASS z2fiori_cl_smp_002_popups DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_status TYPE string VALUE `No popup opened`.

ENDCLASS.

CLASS z2fiori_cl_smp_002_popups IMPLEMENTATION.

  METHOD z2fiori_if_app~main.
    DATA lo_view TYPE REF TO z2fiori_cl_xml_view_builder.
    DATA lo_dlg1 TYPE REF TO z2fiori_cl_xml_view_builder.
    DATA lo_dlg2 TYPE REF TO z2fiori_cl_xml_view_builder.

    IF client->check_init( ).
      lo_view = z2fiori_cl_xml_view_builder=>factory( ).
      lo_view->page( id = `pagePopups` title = `Sample 002 - LIFO Popups`
        )->vbox( class = `sapUiMediumMargin`
          )->text( id = `txtStatus` text = client->bind( mv_status )
          )->button( id = `btnOpenPopup1` text = `Open Dialog 1` press = client->event( `OPEN_1` ) ).

      client->view_display( lo_view->stringify( ) ).

    ELSEIF client->check_event( ).

      CASE client->get_event( ).
        WHEN `OPEN_1`.
          mv_status = `Dialog 1 is open`.
          lo_dlg1 = z2fiori_cl_xml_view_builder=>factory( ).
          lo_dlg1->dialog( id = `dlgFirst` title = `Dialog 1 (LIFO Base)`
            )->vbox( class = `sapUiMediumMargin`
              )->text( `This is Dialog 1.`
              )->button( id = `btnOpenPopup2` text = `Open Dialog 2 (Nested LIFO)` press = client->event( `OPEN_2` )
              )->button( id = `btnClose1` text = `Close Dialog 1` press = client->event( `CLOSE_TOP` ) ).

          client->popup_show( lo_dlg1->stringify( ) ).

        WHEN `OPEN_2`.
          mv_status = `Dialog 2 is open on top of Dialog 1`.
          lo_dlg2 = z2fiori_cl_xml_view_builder=>factory( ).
          lo_dlg2->dialog( id = `dlgSecond` title = `Dialog 2 (LIFO Top)`
            )->vbox( class = `sapUiMediumMargin`
              )->text( `This is Dialog 2 (Top of stack).`
              )->button( id = `btnCloseTop` text = `Close Top Dialog` press = client->event( `CLOSE_TOP` )
              )->button( id = `btnCloseAll` text = `Close All Dialogs` press = client->event( `CLOSE_ALL` ) ).

          client->popup_show( lo_dlg2->stringify( ) ).

        WHEN `CLOSE_TOP`.
          mv_status = `Closed top dialog`.
          client->popup_close( ).

        WHEN `CLOSE_ALL`.
          mv_status = `Closed all dialogs`.
          client->popups_close_all( ).

      ENDCASE.

    ENDIF.

  ENDMETHOD.

ENDCLASS.
