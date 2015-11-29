/***********************************************************************
 * Module:  ZlGlMgmFacade.java
 * Author:  lixiaob
 * Purpose: Defines the Interface ZlGlMgmFacade
 ***********************************************************************/

package com.sgepit.pmis.document.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.pmis.document.dao.ZlGlDAO;
import com.sgepit.pmis.document.hbm.DaDaml;
import com.sgepit.pmis.document.hbm.DaTree;
import com.sgepit.pmis.document.hbm.DaZl;
import com.sgepit.pmis.document.hbm.DaZlJy;
import com.sgepit.pmis.document.hbm.ZlInfoJy;
import com.sgepit.pmis.document.hbm.ZlTree;
import com.sgepit.pmis.routine.hbm.ZbwjGl;
import com.sgepit.pmis.routine.hbm.ZbwjTree;
import com.sgepit.pmis.routine.hbm.ZdGl;
import com.sgepit.pmis.routine.hbm.ZdTree;

/** 资料管理业务实现基本接口
 * 
 * @pdOid b0f27421-cebb-41c3-9e24-c63e92bfd441 */
public interface ZlGlMgmFacade {
	  /*
	   * 保存资料分类树
	   */
	   void SaveZl(ZlTree zltree);
	   /*
	    * 修改资料分类树
	    */
	   void UpdateZltree(ZlTree zltree);
	   /*
	    * 显示资料分类树
	    */
	   List<ColumnTreeNode> ShowZlTree(String parentId,String pid ,String orgids) throws BusinessException;
	   /*
	    * 增加修改资料分类树
	    */
	   int addOrUpdate(ZlTree zltree, String indexid,String orgid);
	   /*
	    * 删除资料分类树
	    */
	   int deleteChildNode(String noid);
	   
	   public String  getuserId(String username);
	   
	   public List getUserOrgid(String userid);
	   
	   public List getdeptname();
	   /*
	    * 上移资料分类树结点
	    */
	   void upzltreenode(String treeid,String indexid,String parenttemp);
	   /*
	    * 下移资料分类树结点
	    */
	   void downzltreenode(String treeid,String indexid,String parenttemp);
	   /*
		 * 资料分类查询dwr
		 */
	   String  querySort(String str);
	   
	   /*
	    * 显示档案分类树
	    */
	   List<ColumnTreeNode> ShowDATree(String parentId, String pid) throws BusinessException;
	   void initDaTree(String pid, String parentId) throws BusinessException;
	   void initZlTree(String deptId, String pid, String parentId) throws BusinessException;
	   
	   /*
	    * 增加修改档案分类树
	    */
	   int addOrUpdateDA(DaTree datree, String indexid);
	   /*
	    * 删除档案分类树
	    */
	   int deleteDAChildNode(String noid);
	   /* 保存档案分类树
	   */
	   void SaveDAtree(DaTree datree);
	   /*
	    * 保存档案组卷
	    */
	   void savedazl(DaZl dazl);
	   /*
	    * 修改档案分类树
	    */
	   void UpdateDAtree(DaTree datree);
	   /*
	    * 增加修改制度分类树
	    */
	   int addOrUpdateZD(ZdTree zdtree, String indexid);
	   /*
	    * 制度分类树
	    */
	   List<ColumnTreeNode> ShowZDTree(String parentId) throws BusinessException;
	   /*
	    * 修改制度分类树
	    */
	   void UpdateZDtree(ZdTree zdtree);
	   /*
	    * 删除制度分类树
	    */
	   int deleteZDChildNode(String noid);

	   /* 保存制度分类树
	    */
	   void SaveZDtree(ZdTree zdtree);
	 
	   public void savezdgl(ZdGl zdgl);
	   public void updatezdgl(ZdGl zdgl);
	   public String getzdbh(String id);
	   public boolean checkzdbh(String id);
	   
	   /*
	    * 招标文件管理
	    */
	   public void UpdateZBWJtree(ZbwjTree zbwjtree);
	   public int addOrUpdateZbwj(ZbwjTree zbwjtree, String indexid);
	   public void savezbwjgl(ZbwjGl zbwjgl);
	   public void updatezbwjgl(ZbwjGl zbwjgl);
	   public String getzbbh(String id);
	   public boolean checkzbbh(String id);
	   public void SaveZbwjtree(ZbwjTree zbwjtree);
	   public int deleteZbwjChildNode(String noid);
	   public String getzbindexid(String parent);

	   /*
	    * 修改档案组卷
	    */
	   void updatedazl(DaZl dazl);
	  
	   
	   List findWhereOrderBy(String string,String s,String b,
				Integer firstRow, Integer maxRow);
	   
	   public List findwhereQuery(String string,String s,String b,
				Integer firstRow, Integer maxRow);
	   
	   public String insertzlinfo(ZlInfo zlinfo);
	   public int insertzlinfo_jy(ZlInfoJy zlinfojy);
	   public int insertzlinfo_gh(ZlInfoJy zlinfojy,int fs);
	   public int update_xj(ZlInfoJy zlinfojy);
	   public String getxj_history(String uids);
	   public boolean updateXh(String infoids);
	   public boolean updateDaXh(String infoids);
	   public String zlrk(ZlInfo zl,String daid);
	   
	   public void updatezlinfo(ZlInfo zlinfo);
	   
	   public void setZlglDAO(ZlGlDAO zlglDAO);
	   
	   public void savegdzl(String[] ids,String daid);
	   
	   public String getzlyc(String id);
	   
	   public int getRowCount(String id);
	   
	   public List getqyml(String id);
	   
	   public String getparentid(String id);
	   
	   public String getindexid(String parent);
	   
	   public String getbzrq(String daid);
	   
	   public void deleteinfo(String[] ids);
	   
	   public void editzlda(ZlInfo zlinfo);
	   
	   public String getdaindexid(String parent);
	   
	   public String getdh(String id);
	   
	   public List getflml(String indexid);
	   
	   public boolean checkdh(String id);
	   
	   public int ZlIsBlank(String indexid);
	   /*
	    * 组卷信息上移
	    * 
	    */
	   void upzjinfo(String id);
	   /*
	    * 组卷信息下移
	    */
	   void downzjinfo(String id);
	   
	   /*
	    * 提交部门的资料移交(申请移交)
	    */
	   void saveDeptHandover(String[] ids) throws BusinessException;
	   /*
	    * 资料移交确认
	    */
	   public void ZlHandoverOk(String[] ids,int state) throws BusinessException;
	   /*
	    * 合同附件归档
	    */
	   public void ZlHandoverContractOk(String[] strArr,String modtabid,String pid,String v_node,String selectedConName,String responpeople,
			                            String USERORGID,String fileno,String selectedConId,boolean flag) throws BusinessException;
	   /*
	    * 招标附件归档
	    */
	   public void ZlHandoverZbzlOk(String ids,String indexid,String unitid) throws BusinessException;
	   /*
	    * 资料退回
	    */
	   void ZlUntread(String[] ids) throws BusinessException;
	   /*
	    * 删除已归档资料，并将状态改为已入库
	    */
	   void ZlGdDel(String[] ids,String selectdaid) throws BusinessException;
	   /*
	    * 档案excel导入
	    */
	   void excelimport(DaDaml daml,String s ) throws Exception;
	   
	   //档案查询资料方法
	   List findwherezlQuery(String string,String s,String b,
				Integer firstRow, Integer maxRow);
	  /*
	   * 档案查询
	   */
	   public int insertdazl_jy(DaZlJy dazljy);
	   /*
	   * 得到档案续借历史
	   */
	   public String getdaxj_history(String uids);
	   
	   /*
	    * 档案续借
	    */
	   public int update_daxj(DaZlJy dazljy);
	   
	   /*
	    *档案归还 
	    */
	   public int insertdazl_gh(DaZlJy dazljy ,int  fs);
	   
	   List<ColumnTreeNode> ShowZBWJTree(String parentId,String pid);
	   
	   /**
		 * 获取机构及其所属子机构的资料树
		 * @param parentId 父节点id
		 * @param orgid 机构id
		 * @return
		 */
		List<ColumnTreeNode> getDeptAndChildZlTree(String parentId,
				String orgid);
		/**
		 * @param pid
		 * @param selectdaid
		 * @param request
		 * @资料档案excel录入
		 * @throws IOException
		 * @throws FileUploadException
		 */
		String ZLDAExcelInputData(String pid,String selectdaid,FileItem fileItem,String userName)throws IOException, FileUploadException;
		/**
		 * @param orderby
		 * @param start
		 * @param limit
		 * @param paramMap
		 * @资料档案点击树进行查询
		 */
		public List newFindwhereorderby( String orderby,Integer start,Integer limit,
		                                HashMap<String, String> paramMap);
		
		public void updataAnther(String daid);
		public void editUpdata(String dzidNo,String daidNo ,int quantity,String yh);
		public void excelInput(String selectdaid);
		
		/**
		 * 获得这个资料的所有大对象流水号信息
		 * @param infoid
		 * @author: Liuay
		 * @createDate: 2012-10-17
		 */
		public String getZlFileLshs(String infoid);
		/**
		 * @param dzidNo
		 * @param selectdaid
		 * @param getPxh
		 * @param maxXh
		 * 增加排序号后修改排序号更新序号
		 */
		public void updateXH(String dzidNo,String selectdaid,Long getPxh,Long firstXh );
		/*
		 * 燃气档案借阅新
		 */
		public int insertda_jy(DaZlJy dazljy);
		
		/**
		 * 根据sql查询cell需要展现的数据；
		 * @param sql
		 * @return
		 * @author: Liuay
		 * @createDate: 2012-11-28
		 */
		public List getListForCellBySql(String sql);
		/**
		 * 
		* @Title: getFileidByBusinessType
		* @Description: 根据模板标识取得模板id
		* @param businessType
		* @return   
		* @return String    
		* @throws
		* @author qiupy 2014-5-20
		 */
		public String getFileidByBusinessType(String businessType);
}