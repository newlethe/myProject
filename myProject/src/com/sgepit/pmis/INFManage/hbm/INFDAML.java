/***********************************************************************
 * Module:  INFDAML.java
 * Author:  Administrator
 * Purpose: Defines the Class INFDAML
 ***********************************************************************/

package com.sgepit.pmis.INFManage.hbm;

import java.util.*;

/** @pdOid 217a9b8d-4dcf-4aef-a476-ae7f94675be4 */
public class INFDAML implements java.io.Serializable  {
	
   /** @pdOid bbe2d909-7338-40c3-9874-d53572abcddc */
   private String pid;
   /** @pdOid 201c7352-524b-4c42-bdc5-98ba8ff40815 */
   private String lsh;
   /** @pdOid 8918f664-15e5-47f0-be1d-7c2e7a704685 */
   private String treeData;
   /** @pdOid 5da07d65-3e79-4d4a-b968-b61287b1dd6f */
   private String datTreeData;//
   /** @pdOid d6f88008-3825-4ed3-a26e-8f23c9370079 */
   private String wjbh;
   /** @pdOid 632799d4-fa88-4c74-aa2b-6d5778762732 */
   private String zrz;
   /** @pdOid 794fd6fe-dc76-4361-a352-d2dca904c50d */
   private String wjcltm;
   /** @pdOid 0ef53807-6907-4e01-a453-dbb7ee44cdca */
   private Date rq;
   /** @pdOid b970958a-0c6c-463f-a7ed-99297e5e1ba6 */
   private Long sl;
   /** @pdOid 61457f2a-e981-4a67-a9c4-ae3e06083d4e */
   private String dw;
   /** @pdOid 16f09fe6-2bc6-42dd-91ff-cc351d7ae9ed */
   private String bz;
   /** @pdOid 1a7f4fdd-3ca8-478c-b313-90bffd688dcd */
   private String zlly;
   /** @pdOid fddb2c36-e65e-40b4-8083-1e142cf39cc4 */
   private Double Dj;//
   /** @pdOid 22eda710-e450-490d-8e35-85cddb983e40 */
   private Date rkrq;
   /** @pdOid 29c8e514-17e9-49fd-998d-dccff20b7d05 */
   private String gjz;
   /** @pdOid 85368fbf-d9cc-4ee5-9697-f15f242bf1ab */
   private String jsr;
   /** @pdOid 599999bb-3c80-4f1f-8a32-4528922fd705 */
   private String userid;
   /** @pdOid ec8b09b7-dd2a-4f85-9421-04f8c38a405d */
   private String fileName;
   /** @pdOid d0a54c71-604c-4fab-934c-21c5d56abdb5 */
   private String fileLsh;
   /** @pdOid bb2011be-2063-4acd-850b-cca8c4a295b9 */
   private String yjr;
   /** @pdOid f113ab58-f333-453c-ab5d-0c4a770e6f07 */
   private String bmxx;//
   /** @pdOid 1c30d454-e881-40aa-a71c-6f915a5e9bed */
   private String ysb;//
   /** @pdOid 7b946293-8484-447b-b58a-cca34123892b */
   private String bgd;
   /** @pdOid 2d0f1d57-fa72-4722-9882-d094115cf1b3 */
   private String ph;
   /** @pdOid 9019a0d4-92b2-497a-8cf7-993de432c64c */
   private Long billState;
   /** @pdOid 23468d32-9689-4470-9e6e-c903ad291b49 */
   private String gcbh;
   /** @pdOid b9db19a8-7cca-47a1-95ef-d22713fb179f */
   private String hth;//
   /** @pdOid 3100d24c-70c4-4974-a4ec-04fd07e5b583 */
   private String sbbm;//
   /** @pdOid 15a519b5-e6aa-4dad-ba7c-ae268d2d3829 */
 
   /** @pdOid 6f292a85-4a1b-46a2-8f70-0fef753f7d4c */
   private String hwh;
   /** @pdOid 6ab83f0b-5af1-41cb-938b-d83df500fb90 */
   private Long bfjs;
   
   private INFSORT infsort;
   
   private String  weavecompany;
   
   private Long book;
   
   private Long portion;
   
   private String orgid;
   
   private String conid;
   
   private Long infgrade;
   
   //private Set infrelease= new HashSet(0);
   
   /** @pdRoleInfo migr=no name=INFRELEASE assc=association2 coll=java.util.Collection impl=java.util.HashSet mult=0..* */
   //public java.util.Collection<INFRELEASE> iNFRELEASE;
 

/**
 * @return the infgrade
 */
public Long getInfgrade() {
	return infgrade;
}

/**
 * @param infgrade the infgrade to set
 */
public void setInfgrade(Long infgrade) {
	this.infgrade = infgrade;
}

/**
 * @return the conid
 */
public String getConid() {
	return conid;
}

/**
 * @param conid the conid to set
 */
public void setConid(String conid) {
	this.conid = conid;
}

/**
 * @return the orgid
 */
public String getOrgid() {
	return orgid;
}

/**
 * @param orgid the orgid to set
 */
public void setOrgid(String orgid) {
	this.orgid = orgid;
}

/**
 * @return the weavecompany
 */
public String getWeavecompany() {
	return weavecompany;
}

/**
 * @param weavecompany the weavecompany to set
 */
public void setWeavecompany(String weavecompany) {
	this.weavecompany = weavecompany;
}

/**
 * @return the book
 */
public Long getBook() {
	return book;
}

/**
 * @param book the book to set
 */
public void setBook(Long book) {
	this.book = book;
}

/**
 * @return the portion
 */
public Long getPortion() {
	return portion;
}

/**
 * @param portion the portion to set
 */
public void setPortion(Long portion) {
	this.portion = portion;
}

/** @pdOid 17d8a411-4dfa-4d2f-8f24-786be4b63ac9 */
   public String getPid() {
      return pid;
   }
   
   /** @param newPid
    * @pdOid 37fb7618-dae4-414e-96b7-ca9326d62dd9 */
   public void setPid(String newPid) {
      pid = newPid;
   }
   
   /** @pdOid 37b44104-11a8-4148-81be-96f64cb3238a */
   public String getLsh() {
      return lsh;
   }
   
   /** @param newLsh
    * @pdOid 36617c71-cc8d-474d-8af6-d5942adb0b50 */
   public void setLsh(String newLsh) {
      lsh = newLsh;
   }
   
   /** @pdOid e4bc4995-e864-49e1-8464-9b47e7f1c3d4 */
   public String getTreeData() {
      return treeData;
   }
   
   /** @param newTreeData
    * @pdOid dad701ee-5a74-489c-9c26-6c92dd3dafa8 */
   public void setTreeData(String newTreeData) {
      treeData = newTreeData;
   }
   
   /** @pdOid d94c0603-0c56-4822-8edf-359a9bc789ff */
   public String getDatTreeData() {
      return datTreeData;
   }
   
   /** @param newDatTreeData
    * @pdOid 3e23fe7f-930e-4988-b4dc-aa1734e78ab7 */
   public void setDatTreeData(String newDatTreeData) {
      datTreeData = newDatTreeData;
   }
   
   /** @pdOid 69d6ee5b-a285-46c0-8d69-4eeb25dacba6 */
   public String getWjbh() {
      return wjbh;
   }
   
   /** @param newWjbh
    * @pdOid 3052e2a6-93dd-4109-988c-f0a55e0cd811 */
   public void setWjbh(String newWjbh) {
      wjbh = newWjbh;
   }
   
   /** @pdOid 9728bfd2-5916-406a-97ca-cd161c3e59b7 */
   public String getZrz() {
      return zrz;
   }
   
   /** @param newZrz
    * @pdOid e67692fd-4680-4bf1-8607-68bb561bf606 */
   public void setZrz(String newZrz) {
      zrz = newZrz;
   }
   
   /** @pdOid 73bf3e7e-46fe-4ff7-a2cb-76f887829889 */
   public String getWjcltm() {
      return wjcltm;
   }
   
   /** @param newWjcltm
    * @pdOid 3d8cea07-5cce-45da-8ecb-9944f68da4c5 */
   public void setWjcltm(String newWjcltm) {
      wjcltm = newWjcltm;
   }
   
  
   
   /**
 * @return the rq
 */
public Date getRq() {
	return rq;
}

/**
 * @param rq the rq to set
 */
public void setRq(Date rq) {
	this.rq = rq;
}


   
   /** @pdOid ce5e4e49-f27e-4df2-b1d4-048e6bf530ad */
   public String getDw() {
      return dw;
   }
   
   /** @param newDw
    * @pdOid 74b1fd94-26f1-47ce-80c2-230c38ef1c63 */
   public void setDw(String newDw) {
      dw = newDw;
   }
   
   /** @pdOid e9eb5176-82a7-4a28-bb19-994c603b007f */
   public String getBz() {
      return bz;
   }
   
   /** @param newBz
    * @pdOid e446a0c2-a521-456b-b89d-bca611580c44 */
   public void setBz(String newBz) {
      bz = newBz;
   }
   
   /** @pdOid aa999a49-f089-4f0e-908a-3f9620155707 */
   public String getZlly() {
      return zlly;
   }
   
   /** @param newZlly
    * @pdOid 7b430518-bced-424f-a439-b4bf8e596ee7 */
   public void setZlly(String newZlly) {
      zlly = newZlly;
   }
   
  
   
   
   /**
 * @return the dj
 */
public Double getDj() {
	return Dj;
}

/**
 * @param dj the dj to set
 */
public void setDj(Double dj) {
	Dj = dj;
}

/**
 * @return the rkrq
 */
public Date getRkrq() {
	return rkrq;
}

/**
 * @param rkrq the rkrq to set
 */
public void setRkrq(Date rkrq) {
	this.rkrq = rkrq;
}

/** @pdOid dbe6c422-aa09-440c-ba89-91dd9c43d65d */
   public String getGjz() {
      return gjz;
   }
   
   /** @param newGjz
    * @pdOid 0b27004d-a2c3-4b68-bf8f-da749df1a71b */
   public void setGjz(String newGjz) {
      gjz = newGjz;
   }
   
   /** @pdOid e3aa777a-73b8-4221-9a77-96f0c2b57b97 */
   public String getJsr() {
      return jsr;
   }
   
   /** @param newJsr
    * @pdOid 70ceec65-0c30-4e05-ad86-63e84a346dd1 */
   public void setJsr(String newJsr) {
      jsr = newJsr;
   }
   
   /** @pdOid 15db494d-46f8-471c-981b-356ac97eda78 */
   public String getUserid() {
      return userid;
   }
   
   /** @param newUserid
    * @pdOid e6cd47c5-3f63-4305-8597-cac2797b7542 */
   public void setUserid(String newUserid) {
      userid = newUserid;
   }
   
   /** @pdOid c1c1d83a-5594-4997-97ea-6e018a3c9f41 */
   public String getFileName() {
      return fileName;
   }
   
   /** @param newFileName
    * @pdOid 2b4594aa-d9b2-4b95-8c20-7a5029690b91 */
   public void setFileName(String newFileName) {
      fileName = newFileName;
   }
   
   /** @pdOid 8fcaa97b-d1f4-4c53-8c60-5e9d6dc95876 */
   public String getFileLsh() {
      return fileLsh;
   }
   
   /** @param newFileLsh
    * @pdOid 50f1c91c-2708-490b-b964-7897a31f845e */
   public void setFileLsh(String newFileLsh) {
      fileLsh = newFileLsh;
   }
   
   /** @pdOid f226bd44-e14b-4bb9-88be-34510193636e */
   public String getYjr() {
      return yjr;
   }
   
   /** @param newYjr
    * @pdOid fdadbd0c-e3ac-4e5d-bffb-276dd18ea6ea */
   public void setYjr(String newYjr) {
      yjr = newYjr;
   }
   
   /** @pdOid 648a43e9-ba37-4bf3-a97e-9bc450e217dc */
   public String getBmxx() {
      return bmxx;
   }
   
   /** @param newBmxx
    * @pdOid d87c48e5-21b8-4d6b-b8bf-495775e284ca */
   public void setBmxx(String newBmxx) {
      bmxx = newBmxx;
   }
   
   /** @pdOid ca8ea51a-f2a0-4f14-b765-4afdb14726a8 */
   public String getYsb() {
      return ysb;
   }
   
   /** @param newYsb
    * @pdOid 2a3bcdba-1e72-4698-8424-8583a0d6ba8b */
   public void setYsb(String newYsb) {
      ysb = newYsb;
   }
   
   /** @pdOid bb1bd4dd-1e05-4330-9416-9f0bb6306fbe */
   public String getBgd() {
      return bgd;
   }
   
   /** @param newBgd
    * @pdOid 0dbaa2ad-0b13-43bf-890c-c5d3101f2b80 */
   public void setBgd(String newBgd) {
      bgd = newBgd;
   }
   
   /** @pdOid d8787557-16aa-4a5f-b537-c55bd5473c51 */
   public String getPh() {
      return ph;
   }
   
   /** @param newPh
    * @pdOid 9cfe791b-7958-4404-936d-d10723e3249b */
   public void setPh(String newPh) {
      ph = newPh;
   }
   
   
   
   /**
 * @return the billState
 */
public Long getBillState() {
	return billState;
}

/**
 * @param billState the billState to set
 */
public void setBillState(Long billState) {
	this.billState = billState;
}

/** @pdOid 015f9462-6f14-4089-bf90-7a5a7b4eaa47 */
   public String getGcbh() {
      return gcbh;
   }
   
   /** @param newGcbh
    * @pdOid ac77ae5d-4137-4df4-aac0-b285704181a2 */
   public void setGcbh(String newGcbh) {
      gcbh = newGcbh;
   }
   
   /** @pdOid 687fcbc9-bb10-4c6c-b665-dcc5463bded0 */
   public String getHth() {
      return hth;
   }
   
   /** @param newHth
    * @pdOid 2d272e8a-b743-4169-8290-daded9fb6ad8 */
   public void setHth(String newHth) {
      hth = newHth;
   }
   
   /** @pdOid e8ec73fc-78a4-4589-92d0-b44cc5c815b1 */
   public String getSbbm() {
      return sbbm;
   }
   
   /** @param newSbbm
    * @pdOid 165b9c79-d361-4ac5-b8d8-b05c3bdd86c2 */
   public void setSbbm(String newSbbm) {
      sbbm = newSbbm;
   }
   
  
   
 

/** @pdOid e31e04e6-8856-4d45-834e-aa9067064cc4 */
   public String getHwh() {
      return hwh;
   }
   
   /** @param newHwh
    * @pdOid 46f6364a-f961-4024-b0c4-c4f66c512469 */
   public void setHwh(String newHwh) {
      hwh = newHwh;
   }
   
  
   
   /**
 * @return the sl
 */
public Long getSl() {
	return sl;
}

/**
 * @param sl the sl to set
 */
public void setSl(Long sl) {
	this.sl = sl;
}

/**
 * @return the bfjs
 */
public Long getBfjs() {
	return bfjs;
}

/**
 * @param bfjs the bfjs to set
 */
public void setBfjs(Long bfjs) {
	this.bfjs = bfjs;
}

/** @pdGenerated default getter *//*
   public java.util.Collection<INFRELEASE> getINFRELEASE() {
      if (iNFRELEASE == null)
         iNFRELEASE = new java.util.HashSet<INFRELEASE>();
      return iNFRELEASE;
   }
   
   *//** @pdGenerated default iterator getter *//*
   public java.util.Iterator getIteratorINFRELEASE() {
      if (iNFRELEASE == null)
         iNFRELEASE = new java.util.HashSet<INFRELEASE>();
      return iNFRELEASE.iterator();
   }*/
   
 /*  *//** @pdGenerated default setter
     * @param newINFRELEASE *//*
   public void setINFRELEASE(java.util.Collection<INFRELEASE> newINFRELEASE) {
      removeAllINFRELEASE();
      for (java.util.Iterator iter = newINFRELEASE.iterator(); iter.hasNext();)
         addINFRELEASE((INFRELEASE)iter.next());
   }*/
   
  /* *//** @pdGenerated default add
     * @param newINFRELEASE *//*
   public void addINFRELEASE(INFRELEASE newINFRELEASE) {
      if (newINFRELEASE == null)
         return;
      if (this.iNFRELEASE == null)
         this.iNFRELEASE = new java.util.HashSet<INFRELEASE>();
      if (!this.iNFRELEASE.contains(newINFRELEASE))
         this.iNFRELEASE.add(newINFRELEASE);
   }
   
   *//** @pdGenerated default remove
     * @param oldINFRELEASE *//*
   public void removeINFRELEASE(INFRELEASE oldINFRELEASE) {
      if (oldINFRELEASE == null)
         return;
      if (this.iNFRELEASE != null)
         if (this.iNFRELEASE.contains(oldINFRELEASE))
            this.iNFRELEASE.remove(oldINFRELEASE);
   }
   */
  /* *//** @pdGenerated default removeAll *//*
   public void removeAllINFRELEASE() {
      if (iNFRELEASE != null)
         iNFRELEASE.clear();
   }*/


/**
 * @return the infsort
 */
public INFSORT getInfsort() {
	return infsort;
}

/**
 * @param infsort the infsort to set
 */
public void setInfsort(INFSORT infsort) {
	this.infsort = infsort;
}



}