/***********************************************************************
 * Module:  INFMgmFacade.java
 * Author:  Administrator
 * Purpose: Defines the Interface INFMgmFacade
 ***********************************************************************/

package com.sgepit.pmis.INFManage.service;

import java.sql.SQLException;
import java.util.*;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.INFManage.hbm.INFDAML;
import com.sgepit.pmis.INFManage.hbm.INFSORT;
import com.sgepit.pmis.common.BusinessConstants;

/** 资料管理业务实现基本接口
 * 
 * @pdOid b0f27421-cebb-41c3-9e24-c63e92bfd441 */
public interface INFMgmFacade {
	
	void saveSort(INFSORT infNo);
   /** 提交资料分类维护信息
    * 
    * @param infNo
    * @pdOid 2a2c1257-50d0-4335-b7a7-213677275c1b */
	
   //void deleteSort(String[] ida) throws SQLException,BusinessException;
   void saveMainte(INFSORT infsort);
   /** 返回资料分类提示信息
    * 
    * @pdOid 4e94056e-7790-42b4-ba99-0c182271c24d */
   INFSORT getINFSor();
   /** 更新资料分类信息
    * 
    * @param infsort
    * @pdOid 5a8d2abf-4739-4867-a58f-2cf04483f578 */
   void updateINFSort(INFSORT infsort)throws SQLException, BusinessException;
   /** 根据INFSort对象删除资料分类
    * 
    * @param infsort
    * @pdOid c48234ef-58d1-4cc8-8cad-0ca51a8e3d6d */
   void delINFSort(List list);
   /** 效验填写完整
    * 
    * @param fileNo
    * @pdOid 13a0bc62-6654-4db3-a6c7-9c00ad548c83 */
   String checkDeptIntact(INFDAML infdaml)throws SQLException, BusinessException;
   /** 提交部门的信息录入
    * 
    * @param infdaml
 * @throws SQLException 
    * @pdOid 1fff51e0-1877-44b4-bd31-e547f4b01fab */
   void saveDeptInfo(INFDAML infdaml) throws SQLException;
   /** 显示部门资料信息
    * 
    * @pdOid b56bcd9d-d593-4355-9cfc-ab13128e30c8 */
   INFDAML showINFDept();
   /** 更新部门资料信息
    * 
    * @param infdaml
    * @pdOid d1c4b987-5c7c-4479-a85c-fcd66b46b369 */
   void updateINFDept(INFDAML infdaml);
   /** @param infdaml
    * @pdOid 959a901b-d512-41e6-8d01-ebeb106c3052 */
   void delINFDept(INFDAML infdaml);
   /** 选择需上传文件并上传
    * 
    * @param fileNo
    * @pdOid e8228bbc-1f34-40c2-99e3-e60f6dcd51d9 */
   int selectFile(String fileNo);
   /** 效验资料文件是否分类正确
    * 
    * @param InfNo
    * @pdOid dcfb564c-e1aa-4dae-86d9-e0709243f4bd */
   int checkInfoSort(String InfNo);
   /** 提交已选中资料信息
    * 
    * @param InfNo
    * @pdOid bf946c2e-95c8-46cc-839b-86c84228f742 */
   void saveInfo(INFDAML infdaml);
   /** 提交选中的资料文件信息
    * 
    * @param InfNo
    * @pdOid c1557878-7467-4d30-9304-194c8b35af08 */
   void saveInfFile(INFDAML infdaml);
   /** 选中正确资料分类并提交
    * 
    * @param InfNo
    * @pdOid bacdbaa2-f30b-43c8-8264-55d6ebd9af28 */
   void saveSelectedSort(String InfNo);
   /** @param lsh 
    * @param userid 
    * @param groupid
    * @pdOid 16dddf56-6df2-4fba-a388-9d8b804746e4 */
   void findInfo(String lsh, String userid, String groupid);
 
   /** 对选中用户的权限进行修改并提交(根据用户编号)
    * 
    * @param userID
    * @pdOid d5e9d0c5-7e6f-4f9b-867d-c25cd5d4cb0e */
   void savaEleRchives(String userID);
   /** 根据对选中用户的权限进行修改并提交(userid+groupid)
    * 
    * @param userID 
    * @param groupID
    * @pdOid ab6079b1-d819-42b4-9a0f-214cb3c3538d */
   void saveEleRchives(String userID, String groupID);
   /** 根据登陆用户权限
    * 
    * @param userID 
    * @param groupID
    * @pdOid ab6079b1-d819-42b4-9a0f-214cb3c3538d */
   List findEleRchives(String userID);
   
   /** @param beanName 
    * @param propertyName 
    * @param value
    * @pdOid dcc4c8dd-5b82-4696-b710-908b012c4591 */
   List findInfByProperty(String beanName, String propertyName, Object value);
   
   List<ColumnTreeNode> InfSortTree(String parentId,String orgid) throws BusinessException;
}