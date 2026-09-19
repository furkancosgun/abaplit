CLASS zcl_abaplit_demo_005 DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    TYPES:
      BEGIN OF ty_node_health,
        node_id TYPE string,
        role    TYPE string,
        cpu     TYPE string,
        memory  TYPE string,
        status  TYPE string,
      END OF ty_node_health.
    TYPES tt_node_health TYPE STANDARD TABLE OF ty_node_health WITH EMPTY KEY.

    DATA mt_nodes        TYPE tt_node_health.
    DATA mv_cluster_name TYPE string VALUE 'ABAP-K8S-EU-CENTRAL'.
    DATA mv_auto_scaling TYPE abap_bool VALUE abap_true.
    DATA mv_cpu_limit    TYPE string VALUE '85'.
    DATA mv_notes        TYPE string VALUE 'Multi-tab container layout with modal dialogs.'.

    METHODS constructor.

ENDCLASS.


CLASS zcl_abaplit_demo_005 IMPLEMENTATION.

  METHOD constructor.
    APPEND VALUE #( node_id = 'sap-app-01' role = 'SICF Worker' cpu = '34%' memory = '2.4GB' status = 'Healthy' )
      TO mt_nodes.
    APPEND VALUE #( node_id = 'sap-app-02' role = 'SICF Worker' cpu = '48%' memory = '3.1GB' status = 'Healthy' )
      TO mt_nodes.
    APPEND VALUE #( node_id = 'sap-db-01'  role = 'HANA DB'     cpu = '72%' memory = '64GB'  status = 'Optimal' )
      TO mt_nodes.
  ENDMETHOD.

  METHOD zif_abaplit_app~main.
    DATA(st) = client->new_view( ).

    " --- Sidebar Navigation ---
    DATA(sb) = st->sidebar( ).
    sb->link_button( label = '<- Back to Dashboard'
                     url   = '?app=zcl_abaplit_demo_000' ).
    sb->divider( ).
    sb->title( 'Cluster Ops' ).
    sb->text_input( label = 'Active Cluster:'
                    value = client->bind( mv_cluster_name ) ).
    sb->toggle( label = 'Enable Auto-Scaling'
                value = client->bind( mv_auto_scaling ) ).
    sb->divider( ).
    sb->metric( label = 'Total Nodes' value = |{ lines( mt_nodes ) } Nodes| ).
    sb->metric( label = 'Health Score' value = '99.8%' delta = '+0.2%' ).

    " --- Main Page ---
    st->title( 'Demo 005: Tabs, Layouts & Modals' ).
    st->write( 'Streamlit multi-tab architecture with columns and modal overlays.' ).

    " Tabs Layout
    DATA(tabs) = st->tabs( count  = 3
                           titles = 'Cluster Health,Modal Dialog,Operations Config' ).

    " ============================================================
    " TAB 1: Cluster Health
    " ============================================================
    DATA(tab1) = tabs->tab( 1 ).
    tab1->header( 'System Node Status' ).

    DATA(kpis) = tab1->columns( 3 ).
    kpis->col( 1 )->metric( label = 'Active Nodes' value = |{ lines( mt_nodes ) }| ).
    kpis->col( 2 )->metric( label = 'Avg CPU Utilization' value = '51.3%' delta = '-2.1%' ).
    kpis->col( 3 )->metric( label = 'Availability' value = '100.0%' delta = 'All OK' ).

    tab1->subheader( 'Capacity Utilization' ).
    tab1->progress( val = '51' text = 'Cluster Capacity: 51%' ).

    tab1->subheader( 'Node Telemetry (Internal Table MT_NODES)' ).
    tab1->table( client->bind( mt_nodes ) ).

    " ============================================================
    " TAB 2: Modal Dialog
    " ============================================================
    DATA(tab2) = tabs->tab( 2 ).
    tab2->header( 'Interactive Modal Dialog' ).
    tab2->write( 'Dialogs in abaplit render as responsive backdrop-blur modal windows.' ).

    DATA(dlg) = tab2->dialog( 'Cluster Maintenance Window' ).
    dlg->write( 'Scheduled maintenance on SAP ICF worker nodes is scheduled for tonight at 02:00 UTC.' ).
    dlg->warning( 'Active sessions will be gracefully drained.' ).
    dlg->button( text = 'Confirm Scheduled Maintenance' type = 'primary' ).

    " ============================================================
    " TAB 3: Operations Config
    " ============================================================
    DATA(tab3) = tabs->tab( 3 ).
    tab3->header( 'Cluster Preferences' ).

    tab3->slider( label = 'CPU Throttle Threshold (%):'
                  min   = '50'
                  max   = '95'
                  value = client->bind( mv_cpu_limit ) ).

    tab3->text_area( label = 'Operations Log & Notes:'
                     value = client->bind( mv_notes ) ).

    tab3->divider( ).
    tab3->success( 'Cluster configuration is synchronized with ABAP state.' ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.

ENDCLASS.
