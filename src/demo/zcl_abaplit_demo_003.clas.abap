CLASS zcl_abaplit_demo_003 DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    TYPES:
      BEGIN OF ty_sales_order,
        vbeln  TYPE string,
        kunnr  TYPE string,
        netwr  TYPE string,
        waerk  TYPE string,
        status TYPE string,
      END OF ty_sales_order.
    TYPES tt_sales_order TYPE STANDARD TABLE OF ty_sales_order WITH EMPTY KEY.

    TYPES:
      BEGIN OF ty_material,
        matnr TYPE string,
        maktx TYPE string,
        werks TYPE string,
        labst TYPE i,
        meins TYPE string,
      END OF ty_material.
    TYPES tt_material TYPE STANDARD TABLE OF ty_material WITH EMPTY KEY.

    DATA mt_sales_orders TYPE tt_sales_order.
    DATA mt_materials    TYPE tt_material.
    DATA mv_total_val    TYPE string VALUE '1,450,200 EUR'.
    DATA mv_total_items  TYPE i VALUE 12.

    METHODS constructor.

ENDCLASS.


CLASS zcl_abaplit_demo_003 IMPLEMENTATION.

  METHOD constructor.
    APPEND VALUE #( vbeln = '10000001' kunnr = 'DE-MUC-01' netwr = '45,200.00' waerk = 'EUR' status = 'Shipped' )
      TO mt_sales_orders.
    APPEND VALUE #( vbeln = '10000002' kunnr = 'US-NYC-04' netwr = '128,500.00' waerk = 'USD' status = 'Processing' )
      TO mt_sales_orders.
    APPEND VALUE #( vbeln = '10000003' kunnr = 'TR-IST-10' netwr = '78,400.00' waerk = 'EUR' status = 'Delivered' )
      TO mt_sales_orders.
    APPEND VALUE #( vbeln = '10000004' kunnr = 'GB-LON-02' netwr = '94,100.00' waerk = 'GBP' status = 'In Review' )
      TO mt_sales_orders.

    APPEND VALUE #( matnr = 'MAT-100-A' maktx = 'Industrial High-Torque Pump' werks = '1000' labst = 350 meins = 'EA' )
      TO mt_materials.
    APPEND VALUE #( matnr = 'MAT-200-B' maktx = 'Stainless Steel Sensor Unit' werks = '1000' labst = 1200 meins = 'PC' )
      TO mt_materials.
    APPEND VALUE #( matnr = 'MAT-300-C' maktx = 'Electronic Controller Board' werks = '2000' labst = 85 meins = 'PC' )
      TO mt_materials.
  ENDMETHOD.

  METHOD zif_abaplit_app~main.
    DATA(st) = client->new_view( ).

    " --- Sidebar Navigation ---
    DATA(sb) = st->sidebar( ).
    sb->link_button( label = '<- Back to Dashboard'
                     url   = '?app=zcl_abaplit_demo_000' ).
    sb->divider( ).
    sb->title( 'Enterprise Summary' ).
    sb->metric( label = 'Total Revenue' value = mv_total_val delta = '+12.4%' ).
    sb->metric( label = 'Open Orders' value = |{ lines( mt_sales_orders ) }| ).
    sb->divider( ).
    sb->download_button( label     = 'Export Orders (CSV)'
                         data      = 'VBELN,KUNNR,NETWR,WAERK,STATUS'
                         file_name = 'sales_orders.csv'
                         mime      = 'text/csv' ).

    " --- Main Content ---
    st->title( 'Demo 003: SAP Business Data & Tables' ).
    st->write( 'Native ABAP internal tables bound to responsive Streamlit dataframes.' ).

    " Header KPIs
    DATA(kpi_cols) = st->columns( 3 ).
    kpi_cols->col( 1 )->metric( label = 'Active Orders' value = |{ lines( mt_sales_orders ) }| delta = '+2' ).
    kpi_cols->col( 2 )->metric( label = 'Material Items' value = |{ mv_total_items }| ).
    kpi_cols->col( 3 )->metric( label = 'Fulfillment Rate' value = '98.5%' delta = '+1.2%' ).

    st->divider( ).

    " Sales Orders Table
    st->header( 'Sales Orders Internal Table' ).
    st->caption( 'Bound directly to internal table MT_SALES_ORDERS:' ).
    st->table( client->bind( mt_sales_orders ) ).

    st->divider( ).

    " Materials Table
    st->header( 'Plant Inventory & Materials' ).
    st->caption( 'Bound directly to internal table MT_MATERIALS:' ).
    st->table( client->bind( mt_materials ) ).

    st->divider( ).

    " Collapsible JSON Representation
    DATA(exp) = st->expander( 'Inspect Raw JSON Serialization of ABAP State' ).
    exp->write( 'Below is the JSON structure produced automatically by the state codec:' ).
    exp->json( client->bind( mt_sales_orders ) ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.

ENDCLASS.
