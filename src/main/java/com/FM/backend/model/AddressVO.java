package com.FM.backend.model;

import java.sql.Date;

public class AddressVO {

  private int address_id;

  private int member_id;

  private String name;
    
  private String phone;

  private String address;

  private String detail_address;

  private String zip_code;

  private Date created_at;

  public int getAddress_id() {
    return address_id;
  }
      
  public void setAddress_id(int address_id) {
    this.address_id = address_id;
  }

  public int getMember_id(){
    return member_id;
  }

  public void setMember_id(int member_id){
    this.member_id = member_id;
  }

  public String getName(){
    return name;
  }

  public void setName(String name){
    this.name = name;
  }

  public String getPhone(){
    return phone;
  }

  public void setPhone(String phone){
    this.phone = phone;
  }

  public String getAddress(){
    return address;
  }

  public void setAddress(String address){
    this.address = address;
  }

  public String getDetail_address(){
    return detail_address;
  }

  public void setDetail_address(String detail_address){
    this.detail_address = detail_address;
  }

  public String getZip_code(){
    return zip_code;
  }

  public void setZip_code(String zip_code){
    this.zip_code = zip_code;
  }

  public Date getCreated_at(){
    return created_at;
  }

  public void setCreated_at(Date created_at){
    this.created_at = created_at;
  }

  @Override
  public String toString() {
    return "AddressVO [member_id="+ member_id + ", member_id=" + member_id + ", name=" + name + ", phone=" + phone
    + ", address=" + address + ", detail_address=" + detail_address + ", zip_code=" + zip_code + ", created_at=" + created_at + "]";
  }
}
