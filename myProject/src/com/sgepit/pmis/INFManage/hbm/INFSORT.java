/***********************************************************************
 * Module:  INFSORT.java
 * Author:  Administrator
 * Purpose: Defines the Class INFSORT
 ***********************************************************************/

package com.sgepit.pmis.INFManage.hbm;

import java.util.*;

/** @pdOid 5671ed50-ef5f-49ec-afb6-ff9ae98b899a */
public class INFSORT implements java.io.Serializable {
	
	
   /** @pdOid ca96a1bb-0ea4-47ac-9442-26f8b57b3131 */
   private String pid;
   /** @pdOid e2d5cb59-94f3-4622-aae0-a1557fe9f3db */
   private String treeData;
   /** @pdOid 9d04ab72-16c4-40f1-8111-be86c238d1cb */
   private String treeLabel;
   /** @pdOid f182709e-8718-4bc6-8620-3be237e7d741 */
   private String bm;
   /** @pdOid ebabdd13-0559-44ff-9727-e6bd0a279adf */
   private Long bmPos;
   
   private Long leaf;
   
   private String parent;
   
   private String action;
   
   private String iconcls;
   
   private String orgid;
   
   //private Set infdaml= new HashSet(0);
   
   /** @pdRoleInfo migr=no name=INFDAML assc=association1 coll=java.util.Collection impl=java.util.HashSet mult=0..* */
  // public java.util.Collection<INFDAML> iNFDAML;
   
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

/** @pdOid 4a74cec8-fa20-4944-bd86-72e360573a2e */
   public String getPid() {
      return pid;
   }
   
   /** @param newPid
    * @pdOid 66d48d2e-7c21-4c22-b49c-1d4fdeca3efc */
   public void setPid(String newPid) {
      pid = newPid;
   }
   
   /** @pdOid 24755830-9781-4820-b38a-6e1c3e43f414 */
   public String getTreeData() {
      return treeData;
   }
   
   /** @param newTreeData
    * @pdOid cd50f51e-be72-4344-a959-d0f4cec0508b */
   public void setTreeData(String newTreeData) {
      treeData = newTreeData;
   }
   
   /** @pdOid 7b528a71-ff99-4835-b1b1-446d28856c02 */
   public String getTreeLabel() {
      return treeLabel;
   }
   
   /** @param newTreeLabel
    * @pdOid 568bd680-0927-433c-8cd2-45773e896ba4 */
   public void setTreeLabel(String newTreeLabel) {
      treeLabel = newTreeLabel;
   }
   
   /** @pdOid 3a311fc5-636e-4990-ba35-b7647e26b99c */
   public String getBm() {
      return bm;
   }
   
   /** @param newBm
    * @pdOid efccc367-25d4-4494-bb5a-37f9fba2aff7 */
   public void setBm(String newBm) {
      bm = newBm;
   }
   
  
   
   /**
 * @return the bmPos
 */
public Long getBmPos() {
	return bmPos;
}

/**
 * @param bmPos the bmPos to set
 */
public void setBmPos(Long bmPos) {
	this.bmPos = bmPos;
}



/**
 * @return the leaf
 */
public Long getLeaf() {
	return leaf;
}

/**
 * @param leaf the leaf to set
 */
public void setLeaf(Long leaf) {
	this.leaf = leaf;
}

/**
 * @return the parent
 */
public String getParent() {
	return parent;
}

/**
 * @param parent the parent to set
 */
public void setParent(String parent) {
	this.parent = parent;
}

/**
 * @return the action
 */
public String getAction() {
	return action;
}

/**
 * @param action the action to set
 */
public void setAction(String action) {
	this.action = action;
}

/**
 * @return the iconcls
 */
public String getIconcls() {
	return iconcls;
}

/**
 * @param iconcls the iconcls to set
 */
public void setIconcls(String iconcls) {
	this.iconcls = iconcls;
}

}