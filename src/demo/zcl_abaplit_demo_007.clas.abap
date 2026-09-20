CLASS zcl_abaplit_demo_007 DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    TYPES:
      BEGIN OF ty_kpi_point,
        label TYPE string,
        value TYPE i,
      END OF ty_kpi_point.
    TYPES tt_kpi_point TYPE STANDARD TABLE OF ty_kpi_point WITH EMPTY KEY.

    TYPES:
      BEGIN OF ty_employee,
        id         TYPE string,
        name       TYPE string,
        department TYPE string,
        location   TYPE string,
        status     TYPE string,
        score      TYPE i,
      END OF ty_employee.
    TYPES tt_employee TYPE STANDARD TABLE OF ty_employee WITH EMPTY KEY.

    TYPES:
      BEGIN OF ty_chat,
        name   TYPE string,
        avatar TYPE string,
        text   TYPE string,
      END OF ty_chat.
    TYPES tt_chat TYPE STANDARD TABLE OF ty_chat WITH EMPTY KEY.

    " --- Input state (two-way bound) ---
    DATA mv_text         TYPE string VALUE 'Hello abaplit'.
    DATA mv_text_pwd     TYPE string VALUE 's3cr3t'.
    DATA mv_number       TYPE string VALUE '42'.
    DATA mv_textarea     TYPE string VALUE 'abaplit brings Streamlit DX to ABAP.'.
    DATA mv_checkbox     TYPE abap_bool VALUE abap_true.
    DATA mv_toggle       TYPE abap_bool VALUE abap_false.
    DATA mv_color        TYPE string VALUE '#ff4b4b'.
    DATA mv_radio        TYPE string VALUE 'Option B'.
    DATA mv_selectbox    TYPE string VALUE 'Enterprise Cloud'.
    DATA mv_multiselect  TYPE string VALUE 'ABAP,Streamlit'.
    DATA mv_pills        TYPE string VALUE 'React'.
    DATA mv_segmented    TYPE string VALUE 'Frontend'.
    DATA mv_feedback_s   TYPE string VALUE '5'.
    DATA mv_feedback_t   TYPE string VALUE 'up'.
    DATA mv_slider       TYPE string VALUE '72'.
    DATA mv_select_sl    TYPE string VALUE 'Medium'.
    DATA mv_date         TYPE string VALUE '2026-09-20'.
    DATA mv_time         TYPE string VALUE '14:30'.
    DATA mv_datetime     TYPE string VALUE '2026-09-20 14:30'.
    DATA mv_chat_draft   TYPE string VALUE ''.

    " --- Data state ---
    DATA mt_employees    TYPE tt_employee.
    DATA mt_chart_q      TYPE tt_kpi_point.
    DATA mt_chart_m      TYPE tt_kpi_point.
    DATA mt_chat_hist    TYPE tt_chat.

    " --- Misc ---
    DATA mv_form_name    TYPE string VALUE ''.
    DATA mv_form_role    TYPE string VALUE 'Developer'.
    DATA mv_progress     TYPE string VALUE '68'.
    DATA mv_sidebar_note TYPE string VALUE 'Widget Gallery'.
    DATA mv_show_extra   TYPE abap_bool VALUE abap_false.

    METHODS constructor.
ENDCLASS.


CLASS zcl_abaplit_demo_007 IMPLEMENTATION.

  METHOD constructor.
    APPEND VALUE #( id = 'E-1001' name = 'Alice Keller'  department = 'Core ERP'    location = 'Walldorf'  status = 'Active'   score = 92 ) TO mt_employees.
    APPEND VALUE #( id = 'E-1002' name = 'Can Yilmaz'    department = 'BTP Cloud'   location = 'Istanbul'  status = 'On Leave' score = 84 ) TO mt_employees.
    APPEND VALUE #( id = 'E-1003' name = 'John Smith'    department = 'Security'    location = 'Palo Alto' status = 'Active'   score = 77 ) TO mt_employees.
    APPEND VALUE #( id = 'E-1004' name = 'Sakura Tanaka' department = 'HANA DB'     location = 'Tokyo'     status = 'Active'   score = 95 ) TO mt_employees.

    APPEND VALUE #( label = 'Q1' value = 42 ) TO mt_chart_q.
    APPEND VALUE #( label = 'Q2' value = 68 ) TO mt_chart_q.
    APPEND VALUE #( label = 'Q3' value = 54 ) TO mt_chart_q.
    APPEND VALUE #( label = 'Q4' value = 95 ) TO mt_chart_q.

    APPEND VALUE #( label = 'Jan' value = 18 ) TO mt_chart_m.
    APPEND VALUE #( label = 'Feb' value = 24 ) TO mt_chart_m.
    APPEND VALUE #( label = 'Mar' value = 36 ) TO mt_chart_m.
    APPEND VALUE #( label = 'Apr' value = 45 ) TO mt_chart_m.
    APPEND VALUE #( label = 'May' value = 40 ) TO mt_chart_m.
    APPEND VALUE #( label = 'Jun' value = 62 ) TO mt_chart_m.

    APPEND VALUE #( name = 'assistant' avatar = 'AB' text = 'Welcome to the complete widget gallery. Every frontend component is showcased here.' ) TO mt_chat_hist.
    APPEND VALUE #( name = 'user'      avatar = 'DV' text = 'Show me all inputs, charts, layouts and media in one place.' ) TO mt_chat_hist.
  ENDMETHOD.

  METHOD zif_abaplit_app~main.

    " ======================================================
    " Event Handling (client -> ABAP)
    " ======================================================
    IF client->check_event( 'EV_TEXT_SUBMIT' ).
      client->toast_display( text = |Text submitted: { mv_text }| duration = '2500' ).
    ENDIF.
    IF client->check_event( 'EV_FORM_SUBMIT' ).
      client->toast_display( text = |Form: { mv_form_name } / { mv_form_role } saved| duration = '3000' ).
      client->set_title( |abaplit: { mv_form_name }| ).
    ENDIF.
    IF client->check_event( 'EV_CHAT_SEND' ).
      APPEND VALUE #( name = 'user' avatar = 'ME' text = 'New message from chat_input event payload.' ) TO mt_chat_hist.
      APPEND VALUE #( name = 'assistant' avatar = 'AB' text = 'abaplit chat_input is reactive via client->bind + on_submit.' ) TO mt_chat_hist.
    ENDIF.
    IF client->check_event( 'EV_TOAST' ).
      client->toast_display( text = 'Server-dispatched toast from ABAP!' duration = '3000' ).
    ENDIF.
    IF client->check_event( 'EV_COPY' ).
      client->clipboard_write( 'abaplit-widget-gallery-2026' ).
      client->toast_display( 'Copied to clipboard!' ).
    ENDIF.
    IF client->check_event( 'EV_NEW_TAB' ).
      client->open_new_tab( 'https://github.com/abaplit/abaplit' ).
    ENDIF.

    DATA(st) = client->new_view( ).

    " ======================================================
    " Sidebar - demonstrates sidebar + many widgets inside
    " ======================================================
    DATA(sb) = st->sidebar( ).
    sb->link_button( label = '<- Back to Hub' url = '?app=zcl_abaplit_demo_000' ).
    sb->divider( ).
    sb->title( 'Widget Gallery' ).
    sb->caption( 'All frontend widgets in one demo' ).
    sb->badge( text = 'v007 Complete' color = '#ff4b4b' ).
    sb->metric( label = 'Total Widgets' value = '48+' delta = 'Complete' ).
    sb->divider( ).
    sb->text_input( label = 'Sidebar Search:' value = client->bind( mv_sidebar_note ) placeholder = 'Filter...' ).
    sb->toggle( label = 'Show Extra Section' value = client->bind( mv_show_extra ) ).
    sb->color_picker( label = 'Theme Accent' value = client->bind( mv_color ) ).
    sb->divider( ).
    sb->download_button( label = 'Download Sample JSON' data = '{"demo":"007","framework":"abaplit"}' file_name = 'abaplit_demo_007.json' mime = 'application/json' ).
    sb->page_link( label = 'Go to Tables Demo' page = '?app=zcl_abaplit_demo_003' ).

    " ======================================================
    " Main Header - Typography
    " ======================================================
    st->title( 'Demo 007: Complete Widget Gallery' ).
    st->write( 'Frontend `web/src/components` altindaki tum widgetlar tek bir ABAP demo icinde eksiksiz sergileniyor. Python/Streamlit karsiligi icin `streamlit_gallery/app.py` dosyasina bakin.' ).
    st->markdown( '**Amac:** Tema, API ve davranis farklarini birebir karsilastirmak icin ayni widget setinin iki implementasyonu.' ).
    st->caption( 'Tip: Her input `client->bind` ile two-way bound. `on_change` aninda, `on_submit` Enter ile tetiklenir (TextInput mantigi).' ).
    st->divider( ).

    " --- Metrics row ---
    DATA(kpi_cols) = st->columns( 3 ).
    kpi_cols->col( 1 )->metric( label = 'Employees' value = |{ lines( mt_employees ) }| delta = '+4' ).
    kpi_cols->col( 2 )->metric( label = 'Coverage' value = '100%' delta = 'All widgets' ).
    kpi_cols->col( 3 )->metric( label = 'Sync Mode' value = 'Reactive' delta = 'bind' ).

    st->divider( ).

    " ======================================================
    " Tabs - organize all categories
    " ======================================================
    DATA(tabs) = st->tabs( count = 4 titles = 'Inputs,Data & Charts,Layout & Feedback,Media & Chat' ).

    " ------------------------------------------------------
    " TAB 1 : INPUTS
    " ------------------------------------------------------
    DATA(t1) = tabs->tab( 1 ).
    t1->header( 'Input Widgets - Full Set' ).
    t1->caption( 'TextInput mantigi: onChange -> on_change(value), Enter -> on_submit(value).' ).
    t1->divider( ).

    DATA(r1) = t1->columns( 2 ).
    DATA(c1a) = r1->col( 1 ).
    c1a->subheader( 'Text & Numeric' ).
    c1a->text_input( label = 'Text Input:' value = client->bind( mv_text ) placeholder = 'Type something...' on_change = 'EV_TEXT_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1a->text_input( label = 'Password Input:' value = client->bind( mv_text_pwd ) placeholder = '***' type = 'password' ).
    c1a->number_input( label = 'Number Input:' value = client->bind( mv_number ) min = '0' max = '100' step = '1' on_change = 'EV_NUM_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1a->text_area( label = 'Text Area:' value = client->bind( mv_textarea ) placeholder = 'Long text...' height = '4' on_change = 'EV_TA_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1a->color_picker( label = 'Color Picker:' value = client->bind( mv_color ) on_change = 'EV_COLOR_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1a->file_uploader( label = 'File Uploader:' accept = '*' on_change = 'EV_FILE_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).

    DATA(c1b) = r1->col( 2 ).
    c1b->subheader( 'Choices' ).
    c1b->checkbox( label = 'Accept Terms (Checkbox)' value = client->bind( mv_checkbox ) on_change = 'EV_CB_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1b->toggle( label = 'Enable Notifications (Toggle)' value = client->bind( mv_toggle ) on_change = 'EV_TOGGLE_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1b->radio( label = 'Radio Group:' options = 'Option A,Option B,Option C' value = client->bind( mv_radio ) on_change = 'EV_RADIO_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1b->selectbox( label = 'Selectbox:' options = 'Core Development,Enterprise Cloud,Quality Assurance,Security' value = client->bind( mv_selectbox ) on_change = 'EV_SEL_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1b->multiselect( label = 'MultiSelect:' options = 'ABAP,Streamlit,Cloud,Fiori,NodeJS,HANA' value = client->bind( mv_multiselect ) on_change = 'EV_MULTI_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1b->pills( label = 'Pills:' options = 'React,Vue,Angular,Svelte' value = client->bind( mv_pills ) on_change = 'EV_PILLS_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    c1b->segmented_control( label = 'Segmented Control:' options = 'Frontend,Backend,Fullstack' value = client->bind( mv_segmented ) on_change = 'EV_SEG_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).

    t1->divider( ).
    DATA(r2) = t1->columns( 2 ).
    r2->col( 1 )->slider( label = 'Slider (0-100):' min = '0' max = '100' value = client->bind( mv_slider ) on_change = 'EV_SLIDER_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    r2->col( 1 )->select_slider( label = 'Select Slider:' options = 'Small,Medium,Large,XLarge' value = client->bind( mv_select_sl ) on_change = 'EV_SLSL_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    r2->col( 1 )->feedback( label = 'Feedback (Stars):' options = 'stars' value = client->bind( mv_feedback_s ) on_change = 'EV_FB_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    r2->col( 1 )->feedback( label = 'Feedback (Thumbs):' options = 'thumbs' value = client->bind( mv_feedback_t ) on_change = 'EV_FB_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).

    r2->col( 2 )->date_input( label = 'Date Input:' value = client->bind( mv_date ) on_change = 'EV_DATE_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    r2->col( 2 )->time_input( label = 'Time Input:' value = client->bind( mv_time ) on_change = 'EV_TIME_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).
    r2->col( 2 )->datetime_input( label = 'DateTime Input:' value = client->bind( mv_datetime ) on_change = 'EV_DT_CHANGE' on_submit = 'EV_TEXT_SUBMIT' ).

    t1->divider( ).
    t1->subheader( 'Actions' ).
    DATA(act_cols) = t1->columns( 3 ).
    act_cols->col( 1 )->button( text = 'Trigger Toast (ABAP)' on_click = client->event( 'EV_TOAST' ) type = 'primary' ).
    act_cols->col( 2 )->button( text = 'Copy Token' on_click = client->event( 'EV_COPY' ) ).
    act_cols->col( 3 )->button( text = 'Open GitHub' on_click = client->event( 'EV_NEW_TAB' ) ).
    t1->link_button( label = 'External Docs' url = 'https://github.com/abaplit/abaplit' ).
    t1->divider( ).
    t1->write( |Current state preview: text="{ mv_text }" number={ mv_number } slider={ mv_slider } color={ mv_color } date={ mv_date } pills={ mv_pills }| ).

    " ------------------------------------------------------
    " TAB 2 : DATA & CHARTS
    " ------------------------------------------------------
    DATA(t2) = tabs->tab( 2 ).
    t2->header( 'Data Display & Charts' ).
    t2->caption( 'ABAP internal tables are bound directly via client->bind and rendered as Streamlit charts/tables.' ).
    DATA(m2cols) = t2->columns( 3 ).
    m2cols->col( 1 )->metric( label = 'Total Employees' value = |{ lines( mt_employees ) }| delta = '+1' ).
    m2cols->col( 2 )->metric( label = 'Avg Score' value = '87.0' delta = '+2.3%' ).
    m2cols->col( 3 )->metric( label = 'Quarterly Max' value = '95' delta = 'Q4' ).
    t2->divider( ).
    t2->subheader( 'Table vs Dataframe (same source)' ).
    t2->table( client->bind( mt_employees ) ).
    t2->dataframe( client->bind( mt_employees ) ).
    t2->divider( ).
    t2->subheader( 'Charts - Line / Bar / Area / Scatter (shared data)' ).
    DATA(ch_cols) = t2->columns( 2 ).
    ch_cols->col( 1 )->write( 'Line Chart (monthly):' ).
    ch_cols->col( 1 )->line_chart( data = client->bind( mt_chart_m ) height = '220' ).
    ch_cols->col( 2 )->write( 'Bar Chart (quarterly):' ).
    ch_cols->col( 2 )->bar_chart( data = client->bind( mt_chart_q ) height = '220' ).
    DATA(ch_cols2) = t2->columns( 2 ).
    ch_cols2->col( 1 )->write( 'Area Chart (monthly):' ).
    ch_cols2->col( 1 )->area_chart( data = client->bind( mt_chart_m ) height = '220' ).
    ch_cols2->col( 2 )->write( 'Scatter Chart (quarterly):' ).
    ch_cols2->col( 2 )->scatter_chart( data = client->bind( mt_chart_q ) height = '220' ).
    t2->divider( ).
    t2->subheader( 'Code, JSON, Latex, HTML' ).
    t2->code( value = 'DATA(st) = client->new_view( ). st->pills( label = ''Stack'' options = ''React,Vue'' value = client->bind( mv_stack ) ).' language = 'abap' ).
    t2->json( client->bind( mt_employees ) ).
    t2->latex( '\sum_{i=1}^{n} x_i = \frac{n(n+1)}{2}' ).
    t2->html( '<div style="padding:10px;border:1px dashed #ff4b4b;border-radius:8px">Custom <b>HTML</b> block rendered via HtmlWidget</div>' ).
    t2->badge( text = 'Data Verified' color = '#09ab3b' ).

    " ------------------------------------------------------
    " TAB 3 : LAYOUT & FEEDBACK
    " ------------------------------------------------------
    DATA(t3) = tabs->tab( 3 ).
    t3->header( 'Layout Containers & Feedback' ).
    DATA(lo_cont) = t3->container( ).
    lo_cont->write( 'Container: generic grouping element (Container.jsx).' ).
    t3->divider( ).
    DATA(lay_cols) = t3->columns( 2 ).
    lay_cols->col( 1 )->write( 'Column 1: left pane' ).
    lay_cols->col( 2 )->write( 'Column 2: right pane' ).
    DATA(lo_exp) = t3->expander( 'Expander: Details & Diagnostics' ).
    lo_exp->write( 'Hidden until clicked. Contains table + json.' ).
    lo_exp->table( client->bind( mt_employees ) ).
    DATA(pop) = t3->popover( 'Popover: Quick Settings' ).
    pop->write( 'Popover renders as overlay (Popover.jsx).' ).
    pop->checkbox( 'Enable verbose logging' ).
    pop->button( text = 'Apply' type = 'primary' ).
    DATA(stat) = t3->status( label = 'Deployment Pipeline' state = 'running' ).
    stat->write( 'Step 1: Build ABAP transpiled bundle.' ).
    stat->write( 'Step 2: Deploy to SICF node.' ).
    stat->progress( value = mv_progress text = |Progress { mv_progress }%| ).
    DATA(lo_dlg) = t3->dialog( 'Dialog: Confirm Action' ).
    lo_dlg->write( 'Dialog renders as modal backdrop (Dialog.jsx). Press X or backdrop to close.' ).
    lo_dlg->warning( 'This is a demo dialog - no backend effect.' ).
    lo_dlg->button( text = 'Confirm' type = 'primary' ).
    t3->divider( ).
    t3->subheader( 'Form (with FormSubmitButton)' ).
    DATA(fm) = t3->form( 'demo_form' ).
    fm->text_input( label = 'Full Name' value = client->bind( mv_form_name ) placeholder = 'Enter name' ).
    fm->selectbox( label = 'Role' options = 'Developer,Architect,Admin' value = client->bind( mv_form_role ) ).
    fm->form_submit_button( label = 'Submit Form' on_click = client->event( 'EV_FORM_SUBMIT' ) type = 'primary' ).
    t3->empty( ).
    t3->divider( ).
    t3->subheader( 'Alerts & Progress' ).
    t3->success( 'Success: All widgets rendered without binding errors.' ).
    t3->info( 'Info: This demo intentionally triggers every widget type.' ).
    t3->warning( 'Warning: File uploader is client-only (no ICF upload yet).' ).
    t3->error( 'Error: Demo error card (no real error).' ).
    t3->progress( value = mv_progress text = 'Overall Completion' ).
    t3->spinner( 'Loading simulation...' ).
    t3->exception( 'DEMO_EXCEPTION: Example stack trace for ExceptionWidget' ).
    DATA(btn_cols) = t3->columns( 3 ).
    btn_cols->col( 1 )->button( text = 'Show Balloons' on_click = client->event( 'EV_BALLOONS' ) ).
    btn_cols->col( 2 )->button( text = 'Show Snow' on_click = client->event( 'EV_SNOW' ) ).
    btn_cols->col( 3 )->button( text = 'Trigger Toast' on_click = client->event( 'EV_TOAST' ) ).
    IF client->check_event( 'EV_BALLOONS' ).
      t3->balloons( ).
    ENDIF.
    IF client->check_event( 'EV_SNOW' ).
      t3->snow( ).
    ENDIF.

    " ------------------------------------------------------
    " TAB 4 : MEDIA & CHAT
    " ------------------------------------------------------
    DATA(t4) = tabs->tab( 4 ).
    t4->header( 'Media, Chat & Misc' ).
    t4->subheader( 'Image / Audio / Video' ).
    t4->image( src = 'https://picsum.photos/seed/abaplit/600/200' caption = 'Random image via ImageWidget (picsum.photos)' width = '600' ).
    t4->audio( 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' ).
    t4->video( 'https://www.w3schools.com/html/mov_bbb.mp4' ).
    t4->divider( ).
    t4->subheader( 'Chat Interface' ).
    LOOP AT mt_chat_hist ASSIGNING FIELD-SYMBOL(<ls_c>).
      DATA(lo_msg) = t4->chat_message( name = <ls_c>-name avatar = <ls_c>-avatar ).
      lo_msg->write( <ls_c>-text ).
    ENDLOOP.
    t4->chat_input( placeholder = 'Type a message and press Enter...' on_submit = client->event( 'EV_CHAT_SEND' ) value = client->bind( mv_chat_draft ) ).
    t4->divider( ).
    t4->subheader( 'HTML / Latex / Code / Badge / Empty' ).
    t4->html( '<b>HTML Widget:</b> renders raw HTML (sanitized). <i>abaplit</i> vs <i>Streamlit</i> theme diff: abaplit uses --st-* CSS vars.' ).
    t4->latex( 'e^{i\pi} + 1 = 0' ).
    t4->code( value = 'st.text_input("Name", value=st.session_state.name)' language = 'python' ).
    t4->badge( text = 'New' color = '#1e88e5' ).
    t4->empty( ).
    t4->divider( ).
    t4->subheader( 'Download & Page Navigation' ).
    t4->download_button( label = 'Download CSV (employees)' data = 'id,name,department' file_name = 'employees.csv' mime = 'text/csv' ).
    t4->page_link( label = 'Page Link: Back to Hub' page = '?app=zcl_abaplit_demo_000' ).
    t4->link_button( label = 'Open abaplit Docs' url = 'https://github.com/abaplit/abaplit' ).

    st->divider( ).
    st->caption( 'Demo 007 generated: covers web/src/components/**/*, web/src/components/inputs/*, data/*, layout/*, chat/*, media/*, feedback/*, charts/*' ).
    st->write( 'Karsilastirma icin: `streamlit_gallery/app.py` dosyasini `streamlit run streamlit_gallery/app.py` ile calistirin; ayni widgetlar Streamlit native temasinda gorunecektir.' ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.

ENDCLASS.
