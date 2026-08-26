CLASS z2fiori_cl_smp_003_nav_child DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_input_from_main TYPE string.
    DATA mv_child_input     TYPE string VALUE `Child Result Data`.

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS z2fiori_cl_smp_003_nav_child IMPLEMENTATION.

  METHOD z2fiori_if_app~main.
    DATA lo_view TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_page TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_vbox TYPE REF TO z2fiori_cl_view_builder.

    IF client->check_init( ).
      lo_view = z2fiori_cl_view_builder=>factory(
        )->ele( n = `View` ns = `mvc`
          )->a( n = `displayBlock` v = `true`
          )->a( n = `height`       v = `100%`
          )->a( n = `xmlns`        v = `sap.m`
          )->a( n = `xmlns:mvc`    v = `sap.ui.core.mvc` ).

      lo_page = lo_view->ele( `Page`
        )->a( n = `id`             v = `pageChild`
        )->a( n = `title`          v = `Sample 003 - Child App`
        )->a( n = `showNavButton`  b = abap_true
        )->a( n = `navButtonPress` v = client->event( `GO_BACK` ) ).

      lo_vbox = lo_page->ele( `VBox` )->a( n = `class` v = `sapUiMediumMargin` ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtReceived`
        )->a( n = `text` v = |Received: { client->bind( mv_input_from_main ) }| ).

      lo_vbox->ele( `Input`
        )->a( n = `id`    v = `inpChild`
        )->a( n = `value` v = client->bind( mv_child_input ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnReturn`
        )->a( n = `text`  v = `Return to Main App`
        )->a( n = `press` v = client->event( `RETURN_RESULT` ) ).

      client->view_display( lo_view->stringify( ) ).

    ELSEIF client->check_event( ).

      CASE client->get_event( ).
        WHEN `RETURN_RESULT`.
          client->nav_leave( mv_child_input ).

        WHEN `GO_BACK`.
          client->nav_leave( ).
      ENDCASE.

    ENDIF.

  ENDMETHOD.

ENDCLASS.
