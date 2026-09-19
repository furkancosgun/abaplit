CLASS zcl_abaplit_demo DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    DATA mo_dashboard TYPE REF TO zcl_abaplit_demo_000.

    METHODS constructor.

ENDCLASS.


CLASS zcl_abaplit_demo IMPLEMENTATION.

  METHOD constructor.
    mo_dashboard = NEW #( ).
  ENDMETHOD.

  METHOD zif_abaplit_app~main.
    mo_dashboard->zif_abaplit_app~main( client ).
  ENDMETHOD.

ENDCLASS.
