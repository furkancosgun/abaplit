CLASS zcl_abaplit_demo_001 DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    TYPES:
      BEGIN OF ty_chart_point,
        label TYPE string,
        value TYPE i,
      END OF ty_chart_point.
    TYPES tt_chart_point TYPE STANDARD TABLE OF ty_chart_point WITH EMPTY KEY.

    DATA mt_quarterly  TYPE tt_chart_point.
    DATA mt_monthly    TYPE tt_chart_point.
    DATA mv_year       TYPE string VALUE '2026'.
    DATA mv_target_kpi TYPE string VALUE '$1.2M'.

    METHODS constructor.

ENDCLASS.


CLASS zcl_abaplit_demo_001 IMPLEMENTATION.

  METHOD constructor.
    APPEND VALUE #( label = 'Q1-2026' value = 42 ) TO mt_quarterly.
    APPEND VALUE #( label = 'Q2-2026' value = 68 ) TO mt_quarterly.
    APPEND VALUE #( label = 'Q3-2026' value = 54 ) TO mt_quarterly.
    APPEND VALUE #( label = 'Q4-2026' value = 95 ) TO mt_quarterly.

    APPEND VALUE #( label = 'Jan' value = 18 ) TO mt_monthly.
    APPEND VALUE #( label = 'Feb' value = 24 ) TO mt_monthly.
    APPEND VALUE #( label = 'Mar' value = 36 ) TO mt_monthly.
    APPEND VALUE #( label = 'Apr' value = 45 ) TO mt_monthly.
    APPEND VALUE #( label = 'May' value = 40 ) TO mt_monthly.
    APPEND VALUE #( label = 'Jun' value = 62 ) TO mt_monthly.
  ENDMETHOD.

  METHOD zif_abaplit_app~main.
    DATA(st) = client->new_view( ).

    " --- Sidebar Navigation ---
    DATA(sb) = st->sidebar( ).
    sb->link_button( label = '<- Back to Dashboard'
                     url   = '?app=zcl_abaplit_demo_000' ).
    sb->divider( ).
    sb->title( 'Analytics Config' ).
    sb->write( 'Adjust view and parameters:' ).
    sb->text_input( label = 'Reporting Fiscal Year:'
                    value = client->bind( mv_year ) ).
    sb->metric( label = 'Target KPI' value = mv_target_kpi delta = '+14%' ).
    sb->divider( ).
    sb->button( text     = 'Simulate Growth Spike'
                on_click = 'SPIKE_DATA'
                type     = 'primary' ).

    " Handle event to dynamically alter internal table data
    IF client->check_event( 'SPIKE_DATA' ).
      LOOP AT mt_monthly ASSIGNING FIELD-SYMBOL(<ls_m>).
        <ls_m>-value = <ls_m>-value + 5.
      ENDLOOP.
      st->success( 'Growth simulated! Internal table refreshed.' ).
      st->balloons( ).
    ENDIF.

    " --- Main Content ---
    st->title( 'Demo 001: Charts & Analytics' ).
    st->write( 'Data visualization powered by ABAP internal tables bound via client->bind.' ).

    " Metrics
    DATA(m_cols) = st->columns( 3 ).
    m_cols->col( 1 )->metric( label = 'Total Growth' value = '84.2%' delta = '+8.5%' ).
    m_cols->col( 2 )->metric( label = 'Active Data Points' value = |{ lines( mt_monthly ) }| ).
    m_cols->col( 3 )->metric( label = 'Quarterly Target' value = mv_target_kpi ).

    st->divider( ).

    " Line Chart
    st->header( 'Monthly Trend (Line Chart)' ).
    st->caption( 'Bound directly to internal table MT_MONTHLY:' ).
    st->line_chart( data = client->bind( mt_monthly ) height = '240' ).

    " Bar Chart
    st->header( 'Quarterly Performance (Bar Chart)' ).
    st->caption( 'Bound directly to internal table MT_QUARTERLY:' ).
    st->bar_chart( data = client->bind( mt_quarterly ) height = '240' ).

    " Area Chart
    st->header( 'Cumulative Projection (Area Chart)' ).
    st->area_chart( data = client->bind( mt_monthly ) height = '240' ).

    st->divider( ).
    st->subheader( 'Raw Underlying ABAP Data' ).
    st->table( client->bind( mt_monthly ) ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.

ENDCLASS.
