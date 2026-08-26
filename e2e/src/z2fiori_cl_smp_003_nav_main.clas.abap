CLASS z2fiori_cl_smp_003_nav_main DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_main_input TYPE string VALUE `Initial Main Value`.
    DATA mv_nav_result TYPE string VALUE `No result yet`.

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS z2fiori_cl_smp_003_nav_main IMPLEMENTATION.

  METHOD z2fiori_if_app~main.
    DATA lo_view TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_page TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_vbox TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_child TYPE REF TO z2fiori_cl_smp_003_nav_child.

    IF client->check_init( ) = abap_true OR client->check_navigated( ) = abap_true.
      IF client->check_navigated( ) = abap_true.
        client->get_nav_prev_arg( IMPORTING result = mv_nav_result ).
        client->toast_display( |Returned from child with: { mv_nav_result }| ).
      ENDIF.

      lo_view = z2fiori_cl_view_builder=>factory(
        )->ele( n = `View` ns = `mvc`
          )->a( n = `displayBlock` v = `true`
          )->a( n = `height`       v = `100%`
          )->a( n = `xmlns`        v = `sap.m`
          )->a( n = `xmlns:mvc`    v = `sap.ui.core.mvc` ).

      lo_page = lo_view->ele( `Page`
        )->a( n = `id`    v = `pageMain`
        )->a( n = `title` v = `Sample 003 - Main Navigation App` ).

      lo_vbox = lo_page->ele( `VBox` )->a( n = `class` v = `sapUiMediumMargin` ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtNavResult`
        )->a( n = `text` v = |Result: { client->bind( mv_nav_result ) }| ).

      lo_vbox->ele( `Input`
        )->a( n = `id`    v = `inpMain`
        )->a( n = `value` v = client->bind( mv_main_input ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnCallChild`
        )->a( n = `text`  v = `Call Child App`
        )->a( n = `press` v = client->event( `CALL_CHILD` ) ).

      client->view_display( lo_view->stringify( ) ).

    ELSEIF client->check_event( ).

      IF client->get_event( ) = `CALL_CHILD`.

        lo_child = NEW z2fiori_cl_smp_003_nav_child( ).
        lo_child->mv_input_from_main = mv_main_input.
        client->nav_call( lo_child ).
      ENDIF.

    ENDIF.

  ENDMETHOD.

ENDCLASS.