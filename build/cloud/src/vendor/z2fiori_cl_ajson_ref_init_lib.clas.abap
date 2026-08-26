class z2fiori_cl_ajson_ref_init_lib definition
  public
  final
  create public.

  public section.

    class-methods create_path_refs_init
      importing
        !it_data_refs       type z2fiori_if_ajson_ref_init=>tty_data_refs
      returning
        value(ri_refs_init) type ref to z2fiori_if_ajson_ref_init
      raising
        z2fiori_cx_ajson_error.

endclass.



class z2fiori_cl_ajson_ref_init_lib implementation.


  method create_path_refs_init.
    create object ri_refs_init type lcl_path_refs_init
      exporting
        it_data_refs = it_data_refs.
  endmethod.
endclass.
