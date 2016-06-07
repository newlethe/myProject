package com.sgepit.pcmis.aqgk.hbm;
// default package

import java.util.Date;


/**
 * PC_AQGK_INSPECTION_BAT entity. @author MyEclipse Persistence Tools
 */

public class PcAqgkInspectionBatInfo {


    // Fields    

     private String uids;
     private String pid;
     private String jypc;
     private Date jysj;
     private Long dangerCount;
     private Double zgwcl;
     private Long wzgCount;
     private Long cqjcCount;
     private Long zgCount;
     private String mainPerson;
     private String inputPerson;
     private Date inputDate;


    // Constructors

    /** default constructor */
    public PcAqgkInspectionBatInfo() {
    }

	/** minimal constructor */
    public PcAqgkInspectionBatInfo(String pid) {
        this.pid = pid;
    }
    
    /** full constructor */
    public PcAqgkInspectionBatInfo(String pid, String jypc, Date jysj, Long dangerCount, Double zgwcl, Long wzgCount, Long cqjcCount, Long zgCount, String mainPerson, String inputPerson, Date inputDate) {
        this.pid = pid;
        this.jypc = jypc;
        this.jysj = jysj;
        this.dangerCount = dangerCount;
        this.zgwcl = zgwcl;
        this.wzgCount = wzgCount;
        this.cqjcCount = cqjcCount;
        this.zgCount = zgCount;
        this.mainPerson = mainPerson;
        this.inputPerson = inputPerson;
        this.inputDate = inputDate;
    }

   
    // Property accessors

    public String getUids() {
        return this.uids;
    }
    
    public void setUids(String uids) {
        this.uids = uids;
    }

    public String getPid() {
        return this.pid;
    }
    
    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getJypc() {
        return this.jypc;
    }
    
    public void setJypc(String jypc) {
        this.jypc = jypc;
    }

    public Date getJysj() {
        return this.jysj;
    }
    
    public void setJysj(Date jysj) {
        this.jysj = jysj;
    }

    public Long getDangerCount() {
        return this.dangerCount;
    }
    
    public void setDangerCount(Long dangerCount) {
        this.dangerCount = dangerCount;
    }

    public Double getZgwcl() {
        return this.zgwcl;
    }
    
    public void setZgwcl(Double zgwcl) {
        this.zgwcl = zgwcl;
    }

    public Long getWzgCount() {
        return this.wzgCount;
    }
    
    public void setWzgCount(Long wzgCount) {
        this.wzgCount = wzgCount;
    }

    public Long getCqjcCount() {
        return this.cqjcCount;
    }
    
    public void setCqjcCount(Long cqjcCount) {
        this.cqjcCount = cqjcCount;
    }

    public Long getZgCount() {
        return this.zgCount;
    }
    
    public void setZgCount(Long zgCount) {
        this.zgCount = zgCount;
    }

    public String getMainPerson() {
        return this.mainPerson;
    }
    
    public void setMainPerson(String mainPerson) {
        this.mainPerson = mainPerson;
    }

    public String getInputPerson() {
        return this.inputPerson;
    }
    
    public void setInputPerson(String inputPerson) {
        this.inputPerson = inputPerson;
    }

    public Date getInputDate() {
        return this.inputDate;
    }
    
    public void setInputDate(Date inputDate) {
        this.inputDate = inputDate;
    }
   








}