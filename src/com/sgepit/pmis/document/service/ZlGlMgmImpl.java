/***********************************************************************
 * Module:  INFManageImpl.java
 * Author:  lixiaob
 * Purpose: Defines the Class INFManageImpl
 ***********************************************************************/

package com.sgepit.pmis.document.service;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import net.sf.json.JSONObject;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.document.dao.ZlGlDAO;
import com.sgepit.pmis.document.hbm.DaDaml;
import com.sgepit.pmis.document.hbm.DaTree;
import com.sgepit.pmis.document.hbm.DaZl;
import com.sgepit.pmis.document.hbm.DaZlJy;
import com.sgepit.pmis.document.hbm.ZlInfoBlobList;
import com.sgepit.pmis.document.hbm.ZlInfoJy;
import com.sgepit.pmis.document.hbm.ZlTree;
import com.sgepit.pmis.routine.hbm.ZbwjGl;
import com.sgepit.pmis.routine.hbm.ZbwjTree;
import com.sgepit.pmis.routine.hbm.ZdGl;
import com.sgepit.pmis.routine.hbm.ZdTree;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.base.Constant;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/** @pdOid df9d644d-22b8-44b6-a838-6b519b9b24f9 */
public class ZlGlMgmImpl extends BaseMgmImpl implements ZlGlMgmFacade {

	// private INFManageDAO infmanageDAO;
	private ZlGlDAO zlglDAO;
	private BusinessException businessException;

	public static ZlGlMgmImpl getFromApplicationContext(ApplicationContext ctx) {

		return (ZlGlMgmImpl) ctx.getBean("zlMgm");
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#SaveZl(com.sgepit
	 * .pmis.document.hbm.ZlTree)
	 */
	public void SaveZl(ZlTree zltree) {
		// TODO Auto-generated method stub
		this.zlglDAO.insert(zltree);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#UpdateZltree(com.
	 * sgepit.pmis.document.hbm.ZlTree)
	 */
	public void UpdateZltree(ZlTree zltree) {
		// TODO Auto-generated method stub
		this.zlglDAO.saveOrUpdate(zltree);
	}

	/**
	 * @return the zlglDAO
	 */
	public ZlGlDAO getZlglDAO() {
		return zlglDAO;
	}

	/**
	 * @param zlglDAO
	 *            the zlglDAO to set
	 */
	public void setZlglDAO(ZlGlDAO zlglDAO) {
		this.zlglDAO = zlglDAO;
	}

	/*
	 * (non-Javadoc)显示资料分类树
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#ShowZlTree(java.lang
	 * .String, java.lang.String)
	 */
	public List<ColumnTreeNode> ShowZlTree(String parentId, String pid,String orgid)
			throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		String whereStr = "";
		whereStr += "parent = '" + parent + "'";
		if (null != orgid && !orgid.equals("")) {
			whereStr +=" and orgid in( select unitid from sgcc_ini_unit start with unitid = '" + orgid + "' connect by prior unitid = upunit)";
		}
		
		if ( pid != null ){
			whereStr +=String.format(" and pid = '%s'", pid);
		}
		
		whereStr +=" order by indexid ";
		
		String sql = "select * from zl_tree where " + whereStr;
		Session ses = HibernateSessionFactory.getSession();
		SQLQuery query = ses.createSQLQuery(sql).addEntity(ZlTree.class);
		List<ZlTree> modules = query.list();
		Iterator<ZlTree> itr = modules.iterator();
		ses.close();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			ZlTree temp = (ZlTree) itr.next();
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getTreeid()); // treenode.id
			n.setText(temp.getMc()); // treenode.text
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("icon-pkg"); // treenode.cls
				// n.setIconCls("task-folder"); // treenode.iconCls
			}
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}

		return list;

	}

	/*
	 * (non-Javadoc)增加修改资料分类树
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#addOrUpdate(com.sgepit
	 * .pmis.document.hbm, java.lang.String)
	 */
	public int addOrUpdate(ZlTree zltree, String indexid, String orgid) {
		int flag = 0;
		String beanName = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.ZL_ZlTree;
		try {
			if ("".equals(zltree.getTreeid())) { // 新增
				/*
				 * 当新增节点是它父节点的第一个子节点，如果该父节点(新 增前是没子节点)原来是[工程量]，就要自动改成[概算]！
				 */
				// 查找是否有同级节点
				List list = (List) this.zlglDAO.findByProperty(beanName,
						"parent", zltree.getParent());
				if (list.isEmpty()) { // 新增节点是它父节点的第一个子节点
					ZlTree parentBdg = (ZlTree) this.zlglDAO.findById(beanName,
							zltree.getParent());
					parentBdg.setIsleaf(new Long(0));
					parentBdg.setOrgid(parentBdg.getOrgid());
					this.UpdateZltree(parentBdg);
				}
				String str = this.getindexid(zltree.getParent());

				if (str == null || str.equals("")) {
					return 0;
				}
				if (str.substring(str.length() - 1, str.length())
						.equals("9999")) {
					return 1;
				}
				zltree.setIndexid(str);
				zltree.setOrgid(orgid);
				this.SaveZl(zltree);
			} else {
				zltree.setIndexid(indexid);
				zltree.setOrgid(orgid);
				this.UpdateZltree(zltree);
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	/**
	 * 系统自动存储编码
	 * 
	 * @param
	 * @return
	 */
	public String getindexid(String parent) {
		String beanName = BusinessConstants.Zlgl_PACKAGE
				.concat(BusinessConstants.ZL_ZlTree);
		ZlTree zltree = (ZlTree) this.zlglDAO.findById(beanName, parent);
		String indexId = zltree.getIndexid();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "  select lpad(nvl(max(TO_NUMBER (substr(t.indexid, length(t.indexid)-3, length(t.indexid)))),0) + 1,4,0) indexid "
				+ "	from ZL_TREE t where t.parent = '" + parent + "'";
		List list = jdbc.queryForList(sql);
		Iterator it = list.iterator();
		while (it.hasNext()) {
			Map map = (Map) it.next();
			String indexId2 = (String) map.get("indexid");
			indexId += indexId2;
		}
		return indexId;

	}

	/*
	 * (non-Javadoc)删除资料分类树
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#deleteChildNode(java
	 * .lang.String)
	 */
	public int deleteChildNode(String noid) {
		int flag = 0;
		String beanName = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.ZL_ZlTree;
		try {
			ZlTree zltree = (ZlTree) this.zlglDAO.findById(beanName, noid);
			List list = (List) this.zlglDAO.findByProperty(beanName, "parent",
					zltree.getParent());
			if (list != null) {
				if (list.size() == 1) { // 删除的节点为该父节点的最后一个
					ZlTree sort = (ZlTree) this.zlglDAO.findById(beanName,
							zltree.getParent());
					sort.setIsleaf(new Long(1));
					this.UpdateZltree(sort);
				}
				this.zlglDAO.delete(zltree);
			} else {
				flag = 1;
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	/*
	 * (non-Javadoc)下移资料分类树结点
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#downzltreenode(java
	 * .lang.String)
	 */
	public void downzltreenode(String treeid, String indexid, String parenttemp) {
		// TODO Auto-generated method stub
		String lastid; // 下一条记录ID
		int minSEQUENCE = 0; // 最小的序号
		int Positions = Integer.parseInt(indexid); // 当前记录序列
		String beanName = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.ZL_ZlTree;
		try {

			String sql = "select min(indexid) from ZL_TREE where  PARENT='"
					+ parenttemp + "'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			minSEQUENCE = jdbc.queryForInt(sql);

			String mynum; // 下移后的序号
			List list = this.zlglDAO.findByWhere(beanName, " indexid>'"
					+ Positions + "' and PARENT='" + parenttemp + "'",
					"indexid");
			if (list.size() > 0) {
				ZlTree zltree;
				for (int i = 0; i < list.size(); i++) {
					zltree = new ZlTree();
					zltree = (ZlTree) list.get(list.size() - 1);
					lastid = zltree.getTreeid();
					String sql0 = "select indexid from ZL_TREE where treeid='"
							+ lastid + "'";
					mynum = (String) jdbc.queryForObject(sql0, String.class);
					if (Positions >= minSEQUENCE) {
						// 交换2个的序号
						String sql3 = "update ZL_TREE set indexid='" + mynum
								+ "' where treeid='" + treeid + "'";
						String sql4 = "update ZL_TREE set indexid='"
								+ Positions + "'  where treeid='" + lastid
								+ "'";;
						jdbc.update(sql3);
						jdbc.update(sql4);
					}
					break;
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	/*
	 * (non-Javadoc)上移资料分类树结点
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#upzltreenode(java
	 * .lang.String)
	 */
	public void upzltreenode(String treeid, String indexid, String parenttemp) {
		String upid; // 序号比当前大一个的记录id
		int Positions = Integer.parseInt(indexid); // 当前记录序列
		int maxnum = 0; // 该列表中最大的序列
		String beanName = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.ZL_ZlTree;
		try {

			String sql = "select max(indexid) from ZL_TREE where  PARENT='"
					+ parenttemp + "'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			maxnum = jdbc.queryForInt(sql);
			String upnum;// 上移后的序列号

			List list = this.zlglDAO.findByWhere(beanName, " indexid<'"
					+ Positions + "' and PARENT='" + parenttemp + "'",
					"indexid");
			if (list.size() > 0) {
				ZlTree zltree;
				for (int i = 0; i < list.size(); i++) {
					zltree = new ZlTree();
					zltree = (ZlTree) list.get(list.size() - 1);
					upid = zltree.getTreeid();
					String sql0 = "select indexid from ZL_TREE where treeid='"
							+ upid + "'";
					upnum = (String) jdbc.queryForObject(sql0, String.class);
					if (Positions <= maxnum) {
						// 交换2个的序号
						String sql3 = "update ZL_TREE set indexid='" + upnum
								+ "' where treeid='" + treeid + "'";
						String sql4 = "update ZL_TREE set indexid='"
								+ Positions + "'  where treeid='" + upid + "'";
						jdbc.update(sql3);
						jdbc.update(sql4);
					}
					break;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String insertzlinfo(ZlInfo zlinfo) {
		if (zlinfo.getQuantity() == null) {
			zlinfo.setQuantity(new Long(0));
		}
		this.zlglDAO.insert(zlinfo);
		List dataList = new ArrayList();
		dataList.add(zlinfo);
		List fileinfoList = null;
		if(zlinfo.getFilelsh()!=null&&!"".equals(zlinfo.getFilelsh())){
			 fileinfoList = zlglDAO.findByProperty(AppFileinfo.class.getName(), "fileid", zlinfo.getFilelsh());
			if(!fileinfoList.isEmpty())
			 dataList.addAll(fileinfoList);
		}
		
		// 获取PCDataExchangeService实例
		PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");
		List ExchangeList = dataExchangeService.getExcDataList(dataList,
				Constant.DefaultOrgRootID, zlinfo.getPid(), "", "", "保存合同附件");
		PcDataExchange tempExc = (PcDataExchange) ExchangeList.get(ExchangeList
				.size() - 1);
		Long curXh = tempExc.getXh() + 1;
		String curTxGroup = tempExc.getTxGroup();
		// 计算大对象
		/*
		if (fileinfoList != null && fileinfoList.size() > 0) {
			for (int k = 0; k < fileinfoList.size(); k++) {
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("APP_BLOB");
				exchange.setBlobCol("BLOB");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				// 大对象表中对应的主键
				kv.put("FILEID", zlinfo.getFilelsh());// 从表中的值
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				// 手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
				exchange.setXh(curXh + k);
				exchange.setPid(Constant.DefaultOrgRootID);
				exchange.setSpareC5(zlinfo.getPid());
				exchange.setTxGroup(curTxGroup);
				ExchangeList.add(exchange);
			}
		}
		*/

		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}

		return zlinfo.getInfoid();
	}

	public void updatezlinfo(ZlInfo zlinfo) {
		this.zlglDAO.saveOrUpdate(zlinfo);
		List dataList = new ArrayList();
		dataList.add(zlinfo);
		if(zlinfo.getFilelsh()!=null&&!"".equals(zlinfo.getFilelsh())){
			List fileinfoList = zlglDAO.findByProperty(AppFileinfo.class.getName(), "fileid", zlinfo.getFilelsh());
			dataList.addAll(fileinfoList);
		}
		
		// 获取PCDataExchangeService实例
		PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");
		List ExchangeList = dataExchangeService.getExcDataList(dataList,
				Constant.DefaultOrgRootID, zlinfo.getPid(), "", "", "修改合同附件");
		PcDataExchange tempExc = (PcDataExchange) ExchangeList.get(ExchangeList
				.size() - 1);
		Long curXh = tempExc.getXh() + 1;
		String curTxGroup = tempExc.getTxGroup();
		// 计算大对象
		/*
		if (zlinfo.getFilelsh() != null && !"".equals(zlinfo.getFilelsh())) {
			PcDataExchange exchange = new PcDataExchange();
			exchange.setTableName("APP_BLOB");
			exchange.setBlobCol("BLOB");
			JSONArray kvarr = new JSONArray();
			JSONObject kv = new JSONObject();
			// 大对象表中对应的主键
			kv.put("FILEID", zlinfo.getFilelsh());// 从表中的值
			kvarr.add(kv);
			exchange.setKeyValue(kvarr.toString());
			exchange.setSuccessFlag("0");
			// 手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
			exchange.setXh(curXh + 1);
			exchange.setPid(Constant.DefaultOrgRootID);
			exchange.setSpareC5(zlinfo.getPid());
			exchange.setTxGroup(curTxGroup);
			ExchangeList.add(exchange);
		}
		*/
		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
		
	}

	public void editzlda(ZlInfo zlinfo) {
		this.zlglDAO.saveOrUpdate(zlinfo);

	}
	// 以下是从editzlda分离出来的代码，此处的目前是因为hibernate的读写与jdbc存在时间差	
	  public void editUpdata(String dzidNo,String daidNo ,int quantity,String yh){
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			String yc = null;// 页号
			String sql1 = "update da_daml set yc='"+quantity+"',yh='"+yh+"' where daid='"+daidNo+"' and dzid='"+dzidNo+"'";
			jdbc.update(sql1);
			String bzrq = this.getbzrq(daidNo);
			String sql2 = "select sum(t.yc) from da_daml t where t.daid='" + daidNo
					+ "'";
//			yc = (String) jdbc.queryForObject(sql2, String.class);
			yc = getzlyc(daidNo);
			String sql4 = "update DA_ZL set zys='" + yc + "',bzrq='" + bzrq
					+ "' where daid='" + daidNo + "'";
			jdbc.update(sql4);
	    }
	/*
	 * 通过DWR获取部门资料名称
	 */
	public List getdeptname() {

		List list = this.zlglDAO.findOrderBy2(
				"com.sgepit.frame.sysman.hbm.SgccIniUnit", null);
		return list;

	}

	/*
	 * 删除资料信息,删除对应的大文本流水号
	 * 
	 * @param getids
	 */
	public void deleteinfo(String[] ids) {
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String beanName = ZlInfo.class.getName();
		for (int i = 0; i < ids.length; i++) {
			List list = this.zlglDAO.findByProperty(beanName, "infoid", ids[i]);
			ZlInfo zlinfo;
			if (!list.isEmpty()) {
				for (int j = 0; j < list.size(); j++) {
					zlinfo = new ZlInfo();
					zlinfo = (ZlInfo) list.get(j);
					String sql = "delete APP_BLOB where fileid='"
							+ zlinfo.getFilelsh() + "'";
					jdbc.execute(sql);
					String sql2 = "delete APP_FILEINFO where FILEID='"
							+ zlinfo.getFilelsh() + "'";
					jdbc.execute(sql2);
					this.zlglDAO.delete(zlinfo);
					List dataList = new ArrayList();
					dataList.add(zlinfo);
					if(zlinfo.getFilelsh()!=null&&!"".equals(zlinfo.getFilelsh())){
						List fileinfoList = zlglDAO.findByProperty(AppFileinfo.class.getName(), "fileid", zlinfo.getFilelsh());
						dataList.addAll(fileinfoList);
					}
					//此处编写大对象数据
					String PIDsql ="select s.unitid from sgcc_ini_unit s where s.unit_type_id='0'";
					List listPID=zlglDAO.getDataAutoCloseSes(PIDsql);
					String PID="";
					for(int k=0;k<listPID.size();k++){
						PID = (String)listPID.get(k);
						break;
					}
					// 获取PCDataExchangeService实例
					PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
							.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService
							.getExchangeDataList(dataList, PID);
					PcDataExchange tempExc = (PcDataExchange) ExchangeList
							.get(ExchangeList.size() - 1);
					Long curXh = tempExc.getXh() + 1;
					String curTxGroup = tempExc.getTxGroup();
					// 计算大对象
					List blobList = null;
					/*
					if (zlinfo.getFilelsh() != null
							&& !"".equals(zlinfo.getFilelsh())) {
						PcDataExchange exchange = new PcDataExchange();
						exchange.setTableName("APP_BLOB");
						exchange.setBlobCol("BLOB");
						JSONArray kvarr = new JSONArray();
						JSONObject kv = new JSONObject();
						// 大对象表中对应的主键
						kv.put("FILEID", zlinfo.getFilelsh());// 从表中的值
						kvarr.add(kv);
						exchange.setKeyValue(kvarr.toString());
						exchange.setSuccessFlag("0");
						// 手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
						exchange.setXh(curXh + 1);
						exchange.setPid(PID);
						exchange.setTxGroup(curTxGroup);
						ExchangeList.add(exchange);
					}
					*/
					dataExchangeService.addExchangeListToQueue(ExchangeList);				
				}
			}

		}
	}

	/*
	 * 资料分类查询dwr (non-Javadoc)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#querySort(java.lang
	 * .String)
	 */
	public String querySort(String str) {
		StringBuffer treedate = new StringBuffer();
		String beanName1 = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.ZL_ZlTree;
		ZlTree zltree;
		List list = this.zlglDAO.findByWhere(beanName1, " mc like '%" + str
				+ "%'");
		if (list.size() > 0) {
			treedate.append("(");
			for (int i = 0; i < list.size(); i++) {
				zltree = new ZlTree();
				zltree = (ZlTree) list.get(i);

				if (treedate.length() == 1) {

					treedate.append("indexid like " + "'" + zltree.getIndexid()
							+ "%" + "'");
				} else {
					treedate.append("or");
					treedate.append(" " + "indexid like " + "'"
							+ zltree.getIndexid() + "%" + "'");
				}
			}
			treedate.append(")");
		}

		return treedate.toString();
	}

	// ///////////////档案管理/////////////////////////////////////////////////////////////////////////////////////////////
	/*
	 * 保存档案分类树
	 */
	public void SaveDAtree(DaTree datree) {
		this.zlglDAO.insert(datree);

	}

	/*
	 * 修改档案分类树 (non-Javadoc)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#UpdateDAtree(com.
	 * sgepit.pmis.document.hbm.DaTree)
	 */
	public void UpdateDAtree(DaTree datree) {
		this.zlglDAO.saveOrUpdate(datree);

	}

	/*
	 * 修改制度分类树
	 */
	public void UpdateZDtree(ZdTree zdtree) {
		this.zlglDAO.saveOrUpdate(zdtree);

	}

	/*
	 * 修改招标文件分类树
	 */
	public void UpdateZBWJtree(ZbwjTree zbwjtree) {
		this.zlglDAO.saveOrUpdate(zbwjtree);

	}

	/*
	 * (non-Javadoc)保存档案组卷
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#savedazl(com.sgepit
	 * .pmis.document.hbm.DaZl)
	 */
	public void savedazl(DaZl dazl) {
		this.zlglDAO.insert(dazl);

	}

	public void savezdgl(ZdGl zdgl) {
		this.zlglDAO.insert(zdgl);

	}

	/*
	 * (non-Javadoc)修改档案组卷
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#updatedazl(com.sgepit
	 * .pmis.document.hbm.DaZl)
	 */
	public void updatedazl(DaZl dazl) {

		// List list =
		// this.zlglDAO.findByProperty(BusinessConstants.Zlgl_PACKAGE.concat(BusinessConstants.DA_Zl),
		// "dh", dazl.getDh());

		// if(this.checkdh(dazl.getDh(), oper)){
		this.zlglDAO.saveOrUpdate(dazl);
		// }
	}

	public void updatezdgl(ZdGl zdgl) {

		// List list =
		// this.zlglDAO.findByProperty(BusinessConstants.Zlgl_PACKAGE.concat(BusinessConstants.DA_Zl),
		// "dh", dazl.getDh());

		// if(this.checkdh(dazl.getDh(), oper)){
		this.zlglDAO.saveOrUpdate(zdgl);
		// }
	}

	/*
	 * 显示档案分类树 (non-Javadoc)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#ShowDATree(java.lang
	 * .String)
	 */
	public List<ColumnTreeNode> ShowDATree(String parentId, String pid)
			throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		StringBuffer bfs = new StringBuffer();
		bfs.append("pid='"+pid+"' and ");
		bfs.append("parent='" + parent);
		bfs.append("' order by indexid ");
		List modules = this.zlglDAO.findByWhere(BusinessConstants.Zlgl_PACKAGE
				.concat(BusinessConstants.DA_Tree), bfs.toString());
		Iterator<DaTree> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			DaTree temp = (DaTree) itr.next();
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getTreeid()); // treenode.id
			String aa = temp.getMc() + "(" + temp.getBm() + ")";
			n.setText(aa);
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("icon-pkg"); // treenode.cls
				// n.setIconCls("task-folder"); // treenode.iconCls
			}
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;
	}

	/*
	 * 增加修改档案分类树 (non-Javadoc)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#addOrUpdate(com.sgepit
	 * .pmis.document.hbm.DaTree, java.lang.String)
	 */
	public int addOrUpdateDA(DaTree datree, String indexid) {
		int flag = 0;
		String beanName = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.DA_Tree;
		try {
			if ("".equals(datree.getTreeid())) { // 新增
				/*
				 * 当新增节点是它父节点的第一个子节点，如果该父节点(新 增前是没子节点)原来是[工程量]，就要自动改成[概算]！
				 */
				// 查找是否有同级节点
				List list = (List) this.zlglDAO.findByProperty(beanName,
						"parent", datree.getParent());
				if (list.isEmpty()) { // 新增节点是它父节点的第一个子节点
					DaTree parentBdg = (DaTree) this.zlglDAO.findById(beanName,
							datree.getParent());
					parentBdg.setIsleaf(new Long(0));
					// parentBdg.setOrgid(parentBdg.getOrgid());
					this.UpdateDAtree(parentBdg);
				}
				String str = this.getdaindexid(datree.getParent());

				if (str == null || str.equals("")) {
					return 0;
				}
				if (str.substring(str.length() - 1, str.length())
						.equals("9999")) {
					return 1;
				}
				datree.setIndexid(str);
				this.SaveDAtree(datree);
			} else {
				datree.setIndexid(indexid);
				this.UpdateDAtree(datree);
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#deleteDAChildNode
	 * (java.lang.String)
	 */
	public int deleteDAChildNode(String noid) {
		int flag = 0;
		String beanName = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.DA_Tree;
		try {
			DaTree datree = (DaTree) this.zlglDAO.findById(beanName, noid);
			List list = (List) this.zlglDAO.findByProperty(beanName, "parent",
					datree.getParent());
			if (list != null) {
				if (list.size() == 1) { // 删除的节点为该父节点的最后一个
					DaTree sort = (DaTree) this.zlglDAO.findById(beanName,
							datree.getParent());
					sort.setIsleaf(new Long(1));
					this.UpdateDAtree(sort);
				}
				this.zlglDAO.delete(datree);
			} else {
				flag = 1;
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	/**
	 * 系统自动存储编码
	 * 
	 * @param
	 * @return
	 */
	public String getdaindexid(String parent) {
		String beanName = BusinessConstants.Zlgl_PACKAGE
				.concat(BusinessConstants.DA_Tree);
		DaTree datree = (DaTree) this.zlglDAO.findById(beanName, parent);
		String indexId = datree.getIndexid();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "  select lpad(nvl(max(TO_NUMBER (substr(t.indexid, length(t.indexid)-3, length(t.indexid)))),0) + 1,4,0) indexid "
				+ "	from DA_TREE t where t.parent = '" + parent + "'";
		List list = jdbc.queryForList(sql);
		Iterator it = list.iterator();
		while (it.hasNext()) {
			Map map = (Map) it.next();
			String indexId2 = (String) map.get("indexid");
			indexId += indexId2;
		}
		return indexId;
	}

	/**
	 * 系统自动存储编码
	 * 
	 * @param
	 * @return
	 */
	public String getzdindexid(String parent) {
		String beanName = BusinessConstants.Zd_PACKAGE
				.concat(BusinessConstants.ZD_Tree);
		ZdTree zdtree = (ZdTree) this.zlglDAO.findById(beanName, parent);
		String indexId = zdtree.getIndexid();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "  select lpad(nvl(max(TO_NUMBER (substr(t.indexid, length(t.indexid)-3, length(t.indexid)))),0) + 1,4,0) indexid "
				+ "	from ZD_TREE t where t.parent = '" + parent + "'";
		List list = jdbc.queryForList(sql);
		Iterator it = list.iterator();
		while (it.hasNext()) {
			Map map = (Map) it.next();
			String indexId2 = (String) map.get("indexid");
			indexId += indexId2;
		}
		return indexId;
	}

	public String getzbindexid(String parent) {
		String beanName = BusinessConstants.Zbwj_PACKAGE
				.concat(BusinessConstants.Zbwj_Tree);
		ZbwjTree zdtree = (ZbwjTree) this.zlglDAO.findById(beanName, parent);
		String indexId = zdtree.getIndexid();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "  select lpad(nvl(max(TO_NUMBER (substr(t.indexid, length(t.indexid)-3, length(t.indexid)))),0) + 1,4,0) indexid "
				+ "	from ZBWJ_TREE t where t.parent = '" + parent + "'";
		List list = jdbc.queryForList(sql);
		Iterator it = list.iterator();
		while (it.hasNext()) {
			Map map = (Map) it.next();
			String indexId2 = (String) map.get("indexid");
			indexId += indexId2;
		}
		return indexId;
	}

	/*
	 * excel导入归档方法 (non-Javadoc)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#excelimport(java.
	 * lang.String, com.sgepit.pmis.document.hbm.DaDaml)
	 */
	public void excelimport(DaDaml daml, String s) throws Exception {
		ZlInfo zl = new ZlInfo();
		zl.setPid("SWDC");
		String[] a = s.split(",");
		zl.setMaterialname(daml.getDafilename());// 资料名称
		zl.setFileno(daml.getDafileno()); // 资料编号
		zl.setWeavecompany(daml.getCompany());// 责任者
		zl.setStockdate(daml.getStockdate());// 入库日期
		if (daml.getYc() == "" || daml.getYc() == null) {
			zl.setQuantity(new Long(0));
		} else {
			zl.setQuantity(Long.parseLong(daml.getYc()));// 页号
		}
		zl.setRemark(daml.getBz()); // 备注
		Date date = null;
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String ss = (String) new SimpleDateFormat("yyyy-MM-dd")
				.format(new Date());
		date = format.parse(ss);
		zl.setRkrq(date);// 入库时期
		zl.setBillstate(new Long(3));// 资料状态
		zl.setResponpeople(a[1]);
		this.zlglDAO.insert(zl);
		// 保存归档资料
		daml.setPid(zl.getPid());
		daml.setZlid(zl.getInfoid());
		daml.setDaid(a[0]);
		daml.setSl(new Long(1));
		// daml.setXh(xh)
		daml.setYc(daml.getYc());
		daml.setStockdate(daml.getStockdate());
		this.zlglDAO.insert(daml);

		// 计算档案总数量,总件数
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String yc = null;// 页号
		int sl = 0;// 数量
		String bzrq = this.getbzrq(a[0]);
		String sql2 = "select sum(t.yc) from da_daml t where t.daid='" + a[0]
				+ "'";
		yc = (String) jdbc.queryForObject(sql2, String.class);
		String sql3 = "select sum(t.sl) from da_daml t where t.daid='" + a[0]
				+ "'";
		sl = jdbc.queryForInt(sql3);
		String sql4 = "update DA_ZL set zys='" + yc + "',bfjs='" + sl
				+ "',bzrq='" + bzrq + "' where daid='" + a[0] + "'";
		jdbc.update(sql4);
	}

	/*
	 * 直接在档案组卷中录入归档资料
	 */
	public String zlrk(ZlInfo zl, String daid) {
		this.zlglDAO.insert(zl);
		DaDaml daml = new DaDaml();
		daml.setPid(zl.getPid());
		daml.setZlid(zl.getInfoid());
		daml.setDaid(daid);
		int xhnum = 0;
		String sql = "select max(xh) from Da_Daml where daid='" + daid + "'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		xhnum = jdbc.queryForInt(sql);
		xhnum++;
		daml.setXh(new Long(xhnum));
		daml.setSl(new Long(1));
		daml.setYc(Long.toString(zl.getQuantity()));
		daml.setStockdate(zl.getStockdate());
		daml.setYh(zl.getYh());
		this.zlglDAO.insert(daml);
		//直接在档案组卷中录入归档资料
		// 计算档案总数量,总件数
		String yc = null;// 页号
		int sl = 0;// 数量
		String bzrq = this.getbzrq(daid);
		String sql2 = "select sum(t.yc) from da_daml t where t.daid='" + daid
				+ "'";
//		yc = (String) jdbc.queryForObject(sql2, String.class);
		yc = getzlyc(daid);
		String sql3 = "select sum(t.sl) from da_daml t where t.daid='" + daid
				+ "'";
		sl = jdbc.queryForInt(sql3);
		String sql4 = "update DA_ZL set zys='" + yc + "',bfjs='" + sl
				+ "',bzrq='" + bzrq + "' where daid='" + daid + "'";
		jdbc.update(sql4);
		return daml.getZlid();
	}
	// 以下是从zlrk分离出来的代码，此处的目前是因为hibernate的读写与jdbc存在时间差
	public void excelInput(String daid){
		String yc = null;// 页号
		int sl = 0;// 数量
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String bzrq = this.getbzrq(daid);
		String sql2 = "select sum(t.yc) from da_daml t where t.daid='" + daid
				+ "'";
		//yc = (String) jdbc.queryForObject(sql2, String.class);
		yc = getzlyc(daid);
		String sql3 = "select sum(t.sl) from da_daml t where t.daid='" + daid
				+ "'";
		sl = jdbc.queryForInt(sql3);
		String sql4 = "update DA_ZL set zys='" + yc + "',bfjs='" + sl
				+ "',bzrq='" + bzrq + "' where daid='" + daid + "'";
		jdbc.update(sql4);
	}

	/*
	 * 保存资料归档份数
	 */
	public void savegdzl(String[] ids, String daid) throws BusinessException {

		ZlInfo zlinfo;
		DaDaml daml;
		DaZl dazl;
		int xhnum = 0;
		for (int i = 0; i < ids.length; i++) {
			zlinfo = (ZlInfo) this.zlglDAO.findById(
					ZlInfo.class.getName(), ids[i]);
			daml = new DaDaml();
			String sql = "select count(*) from Da_Daml where daid='" + daid
					+ "'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			xhnum = jdbc.queryForInt(sql);
			xhnum++;
			daml.setPid(zlinfo.getPid());
			daml.setZlid(zlinfo.getInfoid());
			daml.setDaid(daid);
			daml.setXh(new Long(xhnum));
			daml.setSl(new Long(1));
			daml.setYc(Long.toString(zlinfo.getQuantity() == null ? 0 : zlinfo
					.getQuantity()));
			daml.setStockdate(zlinfo.getStockdate());
			daml.setYh(zlinfo.getYh());
			this.zlglDAO.saveOrUpdate(daml);
			// 更新资料状态，已归档
			if (zlinfo.getBillstate() == 4) {
				this.zlglDAO.saveOrUpdate(zlinfo);
			} else {
				zlinfo.setBillstate(new Long(3));
				this.zlglDAO.saveOrUpdate(zlinfo);
			}
 
		}
	}
	// 以下是从savegdzl分离出来的代码，此处的目前是因为hibernate的读写与jdbc存在时间差
	public void updataAnther(String daid){
		DaDaml daml;
		DaZl dazl;
		// 保存组卷编制日期
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List lista = this.zlglDAO.findByWhere(
				BusinessConstants.Zlgl_PACKAGE
						.concat(BusinessConstants.DA_Zl), " daid='" + daid
						+ "'");
		for (int j = 0; j < lista.size(); j++) {
			dazl = new DaZl();
			dazl = (DaZl) lista.get(j);
			dazl.setBzrq(this.getbzrq(dazl.getDaid()));
			dazl.setZys(this.getzlyc(daid));
			this.zlglDAO.saveOrUpdate(dazl);
		}
		// 计算档案总页数量,总件数
		String yc = null;// 页号
		int sl = 0;// 数量
		String sql2 = "select sum(t.yc) from da_daml t where t.daid='"
				+ daid + "'";
		//yc = (String) jdbc.queryForObject(sql2, String.class);
		yc = this.getzlyc(daid);
		String sql3 = "select sum(t.sl) from da_daml t where t.daid='"
				+ daid + "'";
		sl = jdbc.queryForInt(sql3);
		String sql4 = "update DA_ZL set zys='" + yc + "',bfjs='" + sl
				+ "' where daid='" + daid + "'";
		jdbc.update(sql4);
	}
	
	// 得到编制日期
	public String getbzrq(String daid) {
		String bzrq = null;
		String max = null;
		String min = null;
		try {
			String sql = "select max(stockdate) from DA_DAML where daid='"
					+ daid + "'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			max = (String) jdbc.queryForObject(sql, String.class);
			String sql2 = "select min(stockdate) from DA_DAML where daid='"
					+ daid + "'";
			min = (String) jdbc.queryForObject(sql2, String.class);
			String aa = min.substring(0, 10);
			String bb = max.substring(0, 10);
			bzrq = aa + "~" + bb;
			return bzrq;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return bzrq;

	}

	/*
	 * 部门资料查询方法 (non-Javadoc)public List findwhereQuery(String string, Integer
	 * firstRow, Integer maxRow,HashMap map)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#findwhereorderby(
	 * java.lang.String, java.lang.String, java.lang.String, java.lang.Integer,
	 * java.lang.Integer)
	 */
	public List findwhereQuery(String string, String s, String b,
			Integer firstRow, Integer maxRow) {

		String beanNameB = ZlInfo.class.getName();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List listA = new ArrayList();
		StringBuffer bfs = new StringBuffer();
		int count = s.indexOf("#");
		if (count == -1) {
			if (null != s && !s.equals("")) {
				String[] ss = s.split("~");
				String subStr = "";
				bfs.append(" orgid in(");
				for (int i = 0; i < ss.length; i++) {
					if (i != 0) {
						bfs.append(",");
					}
					bfs.append("'" + ss[i] + "'");
				}
				bfs.append(")");

			}
			listA = this.zlglDAO.findByWhere(beanNameB, bfs.toString()
					+ " and (billstate=2 or billstate=3)");
		} else {

			if (null != s && !s.equals("")) {
				String[] ss = s.split("#");
				listA = this.zlglDAO.findByWhere(beanNameB, " indexid like '"
						+ ss[0] + "%' and (billstate=2 or billstate=3)");
			}
			// System.out.println("=="+bfs.toString());
			// listA = this.zlglDAO.findByWhere(beanNameB,
			// bfs.toString()+" and (billstate=2 or billstate=3)");
		}
		return listA;

	}

	/*
	 * (non-Javadoc)public List findWhereOrderBy(String string, Integer
	 * firstRow, Integer maxRow,HashMap map)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#findwhereorderby(
	 * java.lang.String, java.lang.String, java.lang.String, java.lang.Integer,
	 * java.lang.Integer)
	 */
	public List findWhereOrderBy(String string, String s, String b,
			Integer firstRow, Integer maxRow) {

		String beanNameA = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.DA_Daml;
		String beanNameB = ZlInfo.class.getName();
		String beanNameC = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.DA_Zl;
		String beanNameD = ZlInfoJy.class.getName();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List listA = this.zlglDAO.findByWhere(beanNameA, "" + s
				+ " and zlid in( select distinct infoid from ZL_INFO in class "
				+ beanNameB + " ) order by xh");
		List arr = new ArrayList();
		List listzl;
		String zlid;
		ZlInfo zlinfo = new ZlInfo();
		DaDaml dadaml = new DaDaml();
		try {
			for (int i = 0; i < listA.size(); i++) {
				dadaml = (DaDaml) listA.get(i);
				zlid = dadaml.getZlid();
				listzl = this.zlglDAO.findByProperty(beanNameB, "infoid", zlid);
				if (listzl.size() >= 1) {
					zlinfo = (ZlInfo) listzl.get(0);
					dadaml.setDafileno(zlinfo.getFileno());
					dadaml.setDafilename(zlinfo.getMaterialname());
					dadaml.setDazrz(zlinfo.getResponpeople());
					dadaml.setCompany(zlinfo.getWeavecompany());
					// dadaml.setUint(zlinfo.getBook().toString());
					dadaml.setDzwd(zlinfo.getFilelsh());
					dadaml.setStockdate(zlinfo.getStockdate());
					dadaml.setRkrq(zlinfo.getRkrq());
					dadaml.setYjr(zlinfo.getYjr());
					dadaml.setJsr(zlinfo.getJsr());
					dadaml.setBz(zlinfo.getRemark());
					dadaml.setInsid(zlinfo.getFlwinsid());
					dadaml.setZllx(zlinfo.getZltype());
					//dadaml.setYh(zlinfo.getYh());
					arr.add(dadaml);

				}

			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return arr;

	}

	/**
	 * @param orderby
	 * @param start
	 * @param limit
	 * @param paramMap
	 * @资料档案点击树进行查询
	 */	
	public List<ZlInfo> newFindwhereorderby(String orderby,Integer start,Integer limit,
            HashMap<String, String> paramMap ) {
		Object treeid = paramMap.get("treeid");
		Object pid = paramMap.get("pid");
		Object orgid = paramMap.get("orgid");
		Object billState = paramMap.get("billstate");
		String responPeople = paramMap.get("responpeople");
		String sql = "select z.* from ZL_INFO  z where z.indexid in";
		String whereOrgid ="";
		if(treeid == null || treeid  == ""){
			sql += "(select indexid from zl_tree t2 )";

		}else{
			sql +="( select indexid from zl_tree t2  start with treeid " +
		          "='"+treeid+"' connect by prior treeid =parent )";
		}
		
		if(orgid == null || orgid == ""){
			whereOrgid ="";
		}else{
			whereOrgid= "and orgid='"+orgid+"'";
		}
		if(responPeople!= null){
			sql += " and responpeople='"+responPeople+"'";
		}
		
		if(billState.equals("yes1")){
			sql +=whereOrgid;
		}else if(billState.equals("no68")){
			sql += " and ( billstate<>'6' or billstate<>'8') "+whereOrgid;
		}else if(billState.equals("query")){
			sql +=" and  (billstate=2 or billstate=3 or billstate=1 or billstate=0)"+whereOrgid;
		}else if(billState.equals("yes23")){
			sql +=" and  (billstate=2 or billstate=3)"+whereOrgid;
		}else if(billState.equals("yes26")){
			sql = "select * from ("+ sql +" and billstate='2' or billstate='6') where 1=1 "+whereOrgid;
		}else if(billState.equals("yes6")){
			sql += "  and billstate='6'";
		}else if(billState.equals("yes2")){
			sql += "  and billstate='2'";
		}
		if(orderby ==null || orderby == ""){
			sql +=" and pid='"+pid+"' order by stockdate desc ,fileno asc ";
		}else{
			sql +=" and pid='"+pid+"' order by "+orderby+"";
		}
		
		Session s = HibernateSessionFactory.getSession();
        SQLQuery  query  = s.createSQLQuery(sql).addEntity(ZlInfo.class);
        int size = query.list().size();
        if((start != null) && (limit != null)){
        	query.setFirstResult(start.intValue());
        	query.setMaxResults(limit.intValue());
        }
        List list = query.list();
        list.add(Integer.valueOf(size));
		return list;
		
	}
	
	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#findwherezlQuery(
	 * java.lang.String, java.lang.String, java.lang.String, java.lang.Integer,
	 * java.lang.Integer)
	 */
	public List findwherezlQuery(String string, String s, String b,
			Integer firstRow, Integer maxRow) {
		String beanNameA = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.DA_Daml;
		String beanNameB = ZlInfo.class.getName();
		String beanNameC = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.DA_Zl;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		int count = s.indexOf("#");
		List arr = new ArrayList();
		if (count == -1) {
			List listA = this.zlglDAO
					.findByWhere(
							beanNameA,
							""
									+ s
									+ " and zlid in( select distinct infoid from ZL_INFO in class "
									+ beanNameB + " ) order by xh");
			List listzl;
			String zlid;
			// String dh;
			ZlInfo zlinfo = new ZlInfo();
			DaDaml dadaml = new DaDaml();
			DaZl dazl = new DaZl();
			try {
				for (int i = 0; i < listA.size(); i++) {
					dadaml = (DaDaml) listA.get(i);
					zlid = dadaml.getZlid();
					dazl = (DaZl) this.zlglDAO.findById(beanNameC, dadaml
							.getDaid());
					listzl = this.zlglDAO.findByProperty(beanNameB, "infoid",
							zlid);
					if (listzl.size() >= 1) {

						zlinfo = (ZlInfo) listzl.get(0);
						dadaml.setDafileno(zlinfo.getFileno());
						dadaml.setDafilename(zlinfo.getMaterialname());
						dadaml.setDazrz(zlinfo.getResponpeople());
						dadaml.setCompany(zlinfo.getWeavecompany());
						// dadaml.setUint(zlinfo.getBook().toString());
						dadaml.setDzwd(zlinfo.getFilelsh());
						// dadaml.setStockdate(zlinfo.getStockdate());
						dadaml.setRkrq(zlinfo.getRkrq());
						dadaml.setYjr(zlinfo.getYjr());
						dadaml.setJsr(zlinfo.getJsr());
						dadaml.setBz(zlinfo.getRemark());
						dadaml.setDh(dazl.getDh());
						dadaml.setZllx(zlinfo.getZltype());
						dadaml.setInsid(zlinfo.getFlwinsid());
						arr.add(dadaml);

					}

				}

			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			if (s.length() != 1) {
				String[] ss = s.split("#");
				ZlInfo zlinfo = new ZlInfo();
				DaDaml dadaml = new DaDaml();
				DaZl dazl = new DaZl();
				// List a=this.zlglDAO.findByWhere(beanNameB, ss[0]);
				List a = this.zlglDAO.findByWhere(beanNameA,
						"zlid in( select distinct infoid from ZL_INFO in class "
								+ beanNameB + " where " + ss[0]
								+ " ) order by xh");
				if (a.size() >= 1) {
					for (int i = 0; i < a.size(); i++) {
						dadaml = (DaDaml) a.get(i);
						dazl = (DaZl) this.zlglDAO.findById(beanNameC, dadaml
								.getDaid());
						zlinfo = (ZlInfo) this.zlglDAO.findById(beanNameB,
								dadaml.getZlid());
						if (zlinfo != null) {

							dadaml.setDafileno(zlinfo.getFileno());
							dadaml.setDafilename(zlinfo.getMaterialname());
							dadaml.setDazrz(zlinfo.getResponpeople());
							dadaml.setCompany(zlinfo.getWeavecompany());
							dadaml.setDzwd(zlinfo.getFilelsh());
							dadaml.setRkrq(zlinfo.getRkrq());
							dadaml.setYjr(zlinfo.getYjr());
							dadaml.setJsr(zlinfo.getJsr());
							dadaml.setBz(zlinfo.getRemark());
							dadaml.setDh(dazl.getDh());
							dadaml.setZllx(zlinfo.getZltype());
							dadaml.setInsid(zlinfo.getFlwinsid());
							arr.add(dadaml);
						}
					}
				}
				/*
				 * if(a.size()>=1){
				 * 
				 * for(int j=0;j<a.size();j++){ zlinfo=(ZlInfo)a.get(j); String
				 * id=zlinfo.getInfoid(); List
				 * listb=this.zlglDAO.findByWhere(beanNameA, "zlid='"+id+"'");
				 * if(listb.size()>=1){ for(int k=0;k<listb.size();k++){
				 * dadaml=(DaDaml)listb.get(k); String daid=dadaml.getDaid();
				 * dazl=(DaZl)this.zlglDAO.findById(beanNameC, daid); String
				 * dh=dazl.getDh();
				 * 
				 * dadaml.setDafileno(zlinfo.getFileno());
				 * dadaml.setDafilename(zlinfo.getMaterialname());
				 * dadaml.setDazrz(zlinfo.getResponpeople());
				 * dadaml.setCompany(zlinfo.getWeavecompany());
				 * //dadaml.setUint(zlinfo.getBook().toString());
				 * dadaml.setDzwd(zlinfo.getFilelsh());
				 * //dadaml.setStockdate(zlinfo.getStockdate());
				 * dadaml.setRkrq(zlinfo.getRkrq());
				 * dadaml.setYjr(zlinfo.getYjr());
				 * dadaml.setJsr(zlinfo.getJsr());
				 * dadaml.setBz(zlinfo.getRemark()); dadaml.setDh(dazl.getDh());
				 * arr.add(dadaml);
				 * 
				 * } }
				 * 
				 * } }
				 */
			}
		}
		return arr;

	}

	/**
	 * 提交部门的资料移交(申请移交)
	 * 
	 * @param
	 * @throws BusinessException
	 * @pdOid
	 */
	public void saveDeptHandover(String[] ids) throws BusinessException {

		ZlInfo zlinfo;
		for (int i = 0; i < ids.length; i++) {
			zlinfo = (ZlInfo) this.zlglDAO.findById(
					ZlInfo.class.getName(), ids[i]);
			zlinfo.setBillstate(new Long(1));
			this.zlglDAO.saveOrUpdate(zlinfo);
		}

	}

	/*
	 * (non-Javadoc)移交确认
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#ZlHandoverOk(java
	 * .lang.String[])
	 */
	public void ZlHandoverOk(String[] ids, int state) throws BusinessException {
		ZlInfo zlinfo;
		ZlInfo newzlinfo;
		for (int i = 0; i < ids.length; i++) {
			zlinfo = (ZlInfo) this.zlglDAO.findById(
					ZlInfo.class.getName(), ids[i]);
			zlinfo.setBillstate(new Long(state));
			this.zlglDAO.saveOrUpdate(zlinfo);
		}
		/*
		 * for(int i=0;i<ids.length;i++){ newzlinfo = (ZlInfo) this.zlglDAO
		 * .findById(BusinessConstants.Zlgl_PACKAGE
		 * .concat(BusinessConstants.ZL_Zlinfo), ids[i]);
		 * newzlinfo.setIndexid("10012"); this.zlglDAO.saveOrUpdate(newzlinfo);
		 * }
		 */

	}

	/*
	 * 合同管理附件的资料归档
	 */
	public void ZlHandoverContractOk(String[] strArr,String modtabid,String pid,String v_node,String selectedConName,
			                         String responpeople,String USERORGID,String fileno,String selectedConId,boolean flag)
			throws BusinessException {
				System.out.println(modtabid+"  "+pid+"  "+v_node+"  "+selectedConName+" - 合同文件"+"  "+responpeople+"  "+USERORGID+"  "+fileno+"  "+selectedConId+"  "+flag);
				if(flag){
					ZlInfo zlinfo = new ZlInfo();
					Date date = new Date();
					SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");  
					zlinfo.setPid(pid);
					zlinfo.setIndexid(v_node);
					zlinfo.setFileno(fileno);
					zlinfo.setFilelsh(modtabid);
					zlinfo.setMaterialname(selectedConName);
					zlinfo.setResponpeople(responpeople);
					try {
						zlinfo.setStockdate(sdf.parse(sdf.format(new Date())));
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					zlinfo.setBillstate(new Long(0));
					zlinfo.setOrgid(USERORGID);
					zlinfo.setWeavecompany(responpeople);
					zlinfo.setQuantity(new Long(0));
					zlinfo.setBook(new Long(2));
					try {
						zlinfo.setRkrq(sdf.parse(sdf.format(new Date())));
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					zlinfo.setZltype(new Long(2));
					zlinfo.setBillstate(new Long(0));
					this.zlglDAO.insert(zlinfo);
					
					}
				//移交后更改状态
					for(int i=0;i<strArr.length;i++){
						String  upsql = "update zl_info t set t.billstate='2' where t.infoid='"+strArr[i]+"' and t.modtabid='"+modtabid+"'";
						this.zlglDAO.updateBySQL(upsql);
					}
//		ZlInfo zlinfo;
//		ZlInfo newzlinfo;
//		zlinfo = (ZlInfo) this.zlglDAO.findById(ZlInfo.class.getName(), ids);
//		zlinfo.setBillstate(new Long(2));
//		zlinfo.setIndexid(indexid);
//		this.zlglDAO.saveOrUpdate(zlinfo);
/*	List dataList = new ArrayList();
		dataList.add(zlinfo);
		if(zlinfo.getFilelsh()!=null&&!"".equals(zlinfo.getFilelsh())){
			List fileinfoList = zlglDAO.findByProperty(AppFileinfo.class.getName(), "fileid", zlinfo.getFilelsh());
			dataList.addAll(fileinfoList);
		}
		//此处编写大对象数据
		String sql ="select s.unitid from sgcc_ini_unit s where s.unit_type_id='0'";
		List listPID=zlglDAO.getDataAutoCloseSes(sql);
		String PID="";
		for(int i=0;i<listPID.size();i++){
			PID = (String)listPID.get(i);
			break;
		}
		//获取PCDataExchangeService实例
	   PCDataExchangeService dataExchangeService = 
       (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
	   List ExchangeList = dataExchangeService.getExchangeDataList(dataList, PID);
	   PcDataExchange tempExc = (PcDataExchange)ExchangeList.get(ExchangeList.size()-1);
	   Long curXh = tempExc.getXh()+1;
	   String curTxGroup = tempExc.getTxGroup();
	   //计算大对象
	   List blobList =null;
	   if(zlinfo.getFilelsh()!=null&&!"".equals(zlinfo.getFilelsh())){
		   PcDataExchange  exchange = new PcDataExchange();
		   exchange.setTableName("APP_BLOB");
		   exchange.setBlobCol("BLOB");
		   JSONArray kvarr = new JSONArray();
		   JSONObject kv = new JSONObject();
		   //大对象表中对应的主键
		   kv.put("FILEID", zlinfo.getFilelsh());//从表中的值
		   kvarr.add(kv);
		   exchange.setKeyValue(kvarr.toString());
		   exchange.setSuccessFlag("0");
			//手动设置pid，排序号，事务编号，需要和已有的交换数据列表统一
           exchange.setXh(curXh + 1);
		   exchange.setPid(PID);
		   exchange.setTxGroup(curTxGroup);
		   ExchangeList.add(exchange);
	   }
	   dataExchangeService.addExchangeListToQueue(ExchangeList);*/
	}

	/**
	 * 招标资料移交
	 * 
	 * @param ids
	 * @param indexid
	 * @throws BusinessException
	 */
	public void ZlHandoverZbzlOk(String ids, String indexid, String unitid)
			throws BusinessException {
		String id[] = ids.split("==");
		for (int i = 0; i < id.length; i++) {
			ZbwjGl zbwj = (ZbwjGl) this.zlglDAO.findById(
					BusinessConstants.Zbwj_PACKAGE
							.concat(BusinessConstants.Zbwj_Gl), id[i]);
			ZlInfo zlinfo = new ZlInfo();
			zlinfo.setBillstate(new Long(0));
			zlinfo.setIndexid(indexid);
			zlinfo.setPid("GJMD");
			zlinfo.setFilelsh(zbwj.getFilelsh());
			zlinfo.setFilename(zbwj.getFilename());
			zlinfo.setResponpeople(zbwj.getBzr());
			zlinfo.setStockdate(zbwj.getBzrq());
			zlinfo.setMaterialname(zbwj.getMc());
			zlinfo.setOrgid(unitid);
			this.zlglDAO.saveOrUpdate(zlinfo);

			zbwj.setIsremove("1");
			this.zlglDAO.saveOrUpdate(zbwj);
		}
	}

	/*
	 * (non-Javadoc)组卷信息下移
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#downzjinfo(java.lang
	 * .String)
	 */
	public void downzjinfo(String id) {
		String beanNameA = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.DA_Daml;
		DaDaml daml = new DaDaml();
		// 根据对应的id号查找序号
		daml = (DaDaml) this.zlglDAO.findById(beanNameA, id);
		// int Positions=daml.getXh(); //当前记录序列
		String lastid; // 序号比当前大一个的记录id
		int minSEQUENCE = 0; // 最小的序号
		try {
			String sql = "select min(xh) from DA_DAML where daid='"
					+ daml.getDaid() + "'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			minSEQUENCE = jdbc.queryForInt(sql);
			String upnum;// 下移后的序列号
			List list = this.zlglDAO.findByWhere(beanNameA, "xh>'"
					+ daml.getXh() + "' and daid='" + daml.getDaid() + "'",
					"xh");
			if (list.size() > 0) {
				DaDaml dadaml;
				for (int i = 0; i < list.size(); i++) {
					dadaml = new DaDaml();
					dadaml = (DaDaml) list.get(0);
					lastid = dadaml.getDzid();
					String sql0 = "select xh from DA_DAML where dzid='"
							+ lastid + "' and  daid='" + daml.getDaid() + "'";
					upnum = (String) jdbc.queryForObject(sql0, String.class);
					if (daml.getXh() >= minSEQUENCE) {
						// 交换2个的序号
						String sql3 = "update DA_DAML set xh='" + upnum
								+ "' where dzid='" + daml.getDzid()
								+ "' and  daid='" + daml.getDaid() + "'";
						String sql4 = "update DA_DAML set xh='" + daml.getXh()
								+ "'  where dzid='" + lastid + "' and  daid='"
								+ daml.getDaid() + "'";
						jdbc.update(sql3);
						jdbc.update(sql4);
					}
					break;

				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	/*
	 * (non-Javadoc)组卷信息上移
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#upzjinfo(java.lang
	 * .String)
	 */
	public void upzjinfo(String id) {

		String beanNameA = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.DA_Daml;
		DaDaml daml = new DaDaml();
		// 根据对应的id号查找序号
		daml = (DaDaml) this.zlglDAO.findById(beanNameA, id);
		// int Positions=daml.getXh(); //当前记录序列
		String upid; // 序号比当前大一个的记录id
		int maxnum = 0; // 该列表中最大的序列
		try {
			String sql = "select max(xh) from DA_DAML where daid='"
					+ daml.getDaid() + "'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			maxnum = jdbc.queryForInt(sql);
			String upnum;// 上移后的序列号
			List list = this.zlglDAO.findByWhere(beanNameA, "xh<'"
					+ daml.getXh() + "' and  daid='" + daml.getDaid() + "'",
					"xh");
			if (list.size() > 0) {
				DaDaml dadaml;
				for (int i = 0; i < list.size(); i++) {
					dadaml = new DaDaml();
					dadaml = (DaDaml) list.get(list.size() - 1);
					upid = dadaml.getDzid();
					String sql0 = "select xh from DA_DAML where dzid='" + upid
							+ "' and  daid='" + daml.getDaid() + "'";
					upnum = (String) jdbc.queryForObject(sql0, String.class);
					if (daml.getXh() <= maxnum) {
						// 交换2个的序号
						String sql3 = "update DA_DAML set xh='" + upnum
								+ "' where dzid='" + daml.getDzid()
								+ "' and  daid='" + daml.getDaid() + "'";
						String sql4 = "update DA_DAML set xh='" + daml.getXh()
								+ "'  where dzid='" + upid + "' and  daid='"
								+ daml.getDaid() + "'";
						jdbc.update(sql3);
						jdbc.update(sql4);
					}
					break;

				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/*
	 * 根据用户名得到用户id
	 */
	public String getuserId(String username) {
		String id = null;
		String beanName = "com.sgepit.frame.sysman.hbm.RockUser";
		List list = this.zlglDAO.findByProperty(beanName, "useraccount",
				username);
		if (list.size() > 0) {
			RockUser user;
			for (int i = 0; i < list.size(); i++) {
				user = new RockUser();
				user = (RockUser) list.get(i);
				id = user.getUserid();
			}

		}
		return id;
	}

	/*
	 * 根据用户id得到部门id
	 */
	public List getUserOrgid(String userid) {
		// List list=new ArrayList();
		String beanName = "com.sgepit.frame.sysman.hbm.RockUser2dept";
		List list = this.zlglDAO.findByProperty(beanName, "userid", userid);
		// JdbcTemplate jdbc = Constant.getJdbcTemplate();
		// String
		// sql="select * from sys_org t where t.orgid in(select orgid from sys_userorg t where t.userid='"+userid+"')"
		// ;
		// list=jdbc.queryForList(sql);
		return list;
	}

	/*
	 * (non-Javadoc)资料退回
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#ZlUntread(java.lang
	 * .String[])
	 */
	public void ZlUntread(String[] ids) throws BusinessException {
		ZlInfo zlinfo;
		for (int i = 0; i < ids.length; i++) {
			zlinfo = (ZlInfo) this.zlglDAO.findById(
					ZlInfo.class.getName(), ids[i]);
			zlinfo.setBillstate(new Long(0));
			this.zlglDAO.saveOrUpdate(zlinfo);
		}
	}

	/*
	 * (non-Javadoc)删除已归档资料，并将状态改为已入库,并修改总页数
	 * 
	 * @see
	 * com.hdkj.webpmis.domain.business.zlgl.ZlGlMgmFacade#ZlGdDel(java.lang
	 * .String[])
	 */
	public void ZlGdDel(String[] ids,String selectdaid) throws BusinessException {
		DaDaml daml;
		ZlInfo zlinfo;
		String where = "";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		for (int i = 0; i < ids.length; i++) {
			if(i == ids.length-1){
				where += "'"+ids[i]+"'";
			}else{
				where += "'"+ids[i]+"',";
			}
			daml = (DaDaml) this.zlglDAO.findById(
					BusinessConstants.Zlgl_PACKAGE
							.concat(BusinessConstants.DA_Daml), ids[i]);
			List list = this.zlglDAO.findByProperty(
					ZlInfo.class.getName(), "infoid",
					daml.getZlid());
			if (list.size() > 0) {
				for (int j = 0; j < list.size(); j++) {
					zlinfo = new ZlInfo();
					zlinfo = (ZlInfo) list.get(j);
					String sql = "update ZL_INFO set billstate=2 where infoid='"
							+ zlinfo.getInfoid() + "' ";
					jdbc.update(sql);
					String updateXH ="update da_daml set xh=(xh-1) where daid='"+selectdaid+"' and xh>(select xh from  da_daml  where dzid='"+ids[i]+"')";
					this.zlglDAO.updateBySQL(updateXH);
					this.zlglDAO.delete(daml);
				}
			}

			String sql1 = "select xh from DA_DAML where daid='"
					+ daml.getDaid() + "'";
			List list1 = jdbc.queryForList(sql1);

		}
		//修改总页数
		String yc = null;// 页号
		yc = getzlyc(selectdaid);
		//修改总页数
		String updataYs = " update da_zl t set t.zys = " +yc+
				          " where t.daid ='"+selectdaid+"'";
		jdbc.update(updataYs);

	}

	/*
	 * 验证档号唯一
	 * 
	 * public boolean checkdh(String id,String yz){ if(yz.equals("1")){ //return
	 * true; List list1 =
	 * this.zlglDAO.findByProperty(BusinessConstants.Zlgl_PACKAGE
	 * .concat(BusinessConstants.DA_Zl), "dh", id); if(list1.size()>0){ return
	 * false; }else{ return true; } }else{ List list =
	 * this.zlglDAO.findByProperty
	 * (BusinessConstants.Zlgl_PACKAGE.concat(BusinessConstants.DA_Zl), "dh",
	 * id); if (list.size()>0) return false; return true; } }
	 */
	/*
	 * 验证档号唯一
	 */
	public boolean checkdh(String id) {

		List list = this.zlglDAO.findByProperty(BusinessConstants.Zlgl_PACKAGE
				.concat(BusinessConstants.DA_Zl), "dh", id);
		if (list.size() > 0)
			return false;
		return true;

	}

	public boolean checkzdbh(String id) {

		List list = this.zlglDAO.findByProperty(BusinessConstants.Zd_PACKAGE
				.concat(BusinessConstants.ZD_Gl), "zdbh", id);
		if (list.size() > 0)
			return false;
		return true;

	}

	//
	public String getdh(String id) {
		String getdh = null;
		DaZl dazl = new DaZl();
		dazl = (DaZl) this.zlglDAO.findById(BusinessConstants.Zlgl_PACKAGE
				.concat(BusinessConstants.DA_Zl), id);
		if (dazl != null) {
			getdh = dazl.getDh();
			return getdh;
		}
		return getdh;

	}

	public String getzdbh(String id) {
		String getzdbh = null;
		ZdGl zdgl = new ZdGl();
		zdgl = (ZdGl) this.zlglDAO.findById(BusinessConstants.Zd_PACKAGE
				.concat(BusinessConstants.ZD_Gl), id);
		if (zdgl != null) {
			getzdbh = zdgl.getZdbh();
			return getzdbh;
		}
		return getzdbh;

	}

	public int getRowCount(String id) {
		int i = 0;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select  count(*) from  DA_DAML where daid='" + id + "'";
		i = jdbc.queryForInt(sql);
		return i;

	}

	public List getqyml(String id) {
		List list = new ArrayList();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		// String
		// sql="select  rownum,FILENO,WEAVECOMPANY,MATERIALNAME,a.STOCKDATE,b.yc  from  ZL_INFO a,DA_DAML b  where  a.infoid in(select  ZLID from DA_DAML where DAID='"+id+"')  and b.daid='"+id+"' and b.zlid=a.infoid";
		// String
		// sql="select  b.XH,FILENO,c.partyb as WEAVECOMPANY,MATERIALNAME,a.STOCKDATE,b.yc  from  ZL_INFO a,DA_DAML b,CON_PARTYB c where  a.infoid in(select  ZLID from DA_DAML where DAID='"+id+"')  and b.daid='"+id+"' and b.zlid=a.infoid and c.cpid(+)=a.weavecompany order by b.xh"
		// ;
		String sql = "select  b.XH,FILENO,WEAVECOMPANY,("+
		//以上是对文件后缀名称进行相关的过滤去掉
			       " CASE "+
			       "  WHEN "+
			       "  LOWER(substr(MATERIALNAME,  instr(MATERIALNAME, '.', -1)+1,length(MATERIALNAME)))  IN "+
			       "  ('doc','docx','xls','xlsx','jpg','png','pdf','rar','zip','dwt','dwg','dws','dxf') "+
			       " THEN substr(MATERIALNAME, 0, instr(MATERIALNAME, '.', -1) - 1) "+
			       "  ELSE "+
			       " MATERIALNAME "+
			       " END "+
			       " )  as MATERIALNAME,a.STOCKDATE, a.yh,b.yc,(case  when b.yc =0 and b.yh is not null then b.yh when b.yc <>0 and b.yh is null then b.yc when b.yc <>0 and b.yh is not null then b.yh when b.yc =0 and b.yh is null then '' end )ys,a.REMARK" +//b.yc //国锦（b.yc）及燃气（a.yh）对页号页数的区分
			       " from  ZL_INFO a,DA_DAML b,CON_PARTYB c where  a.infoid in(select  ZLID from DA_DAML where DAID='"
				   + id
				   + "')  and b.daid='"
				   + id
				   + "' and b.zlid=a.infoid and c.cpid(+)=a.weavecompany order by b.xh";
		list = jdbc.queryForList(sql);
		return list;

	}

	// 计算页数
	public String getzlyc(String id) {
		String yc = null;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		try {
			// String sql="select B from da_daml_yc  t where t.daid='"+id+"'";
			String sql = "select sum(nvl(t.yc,0)) from da_daml t where t.daid='" + id
					+ "'";
			String value1=(String) jdbc.queryForObject(sql, String.class);
			if(value1!=null&&value1.length()>0&&!"0".equals(value1)){
				yc=value1;
			}else{
				sql = "select MAX(DECODE(INSTR(t.Yh,'-'),-1,0,SUBSTR(t.Yh,INSTR(t.Yh,'-')+1))) from da_daml t where t.daid='" + id
				+ "'";
				value1=(String) jdbc.queryForObject(sql, String.class);
				if(value1!=null&&value1.length()>0&&!"0".equals(value1)){
					yc=value1;
				}
			}
			return yc;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return yc;
	}

	public String getparentid(String id) {

		SgccIniUnit org = (SgccIniUnit) this.zlglDAO.findById(
				"com.sgepit.frame.sysman.hbm.SgccIniUnit", id);

		return org.getUpunit();

	}

	// 查询分类下是否还有资料
	public int ZlIsBlank(String indexid) {
		int cn = 0;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select  count(*) from  zl_info where indexid like '"
				+ indexid + "%'";
		cn = jdbc.queryForInt(sql);
		return cn;
	}

	/*
	 * 分类目录表//报表
	 */
	public List getflml(String indexid) {
		List list = new ArrayList();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select rownum as XH,a.dh as DH,a.mc as MC,b.codevalue as DW,a.bzrq as BZRQ,decode(a.bgqx,1,'短期',2,'长期',3,'永久')  as QX, a.zys ZYS,a.bz as BZ from da_zl a, app_codevalue b  where  b.catid=(select c.catid from app_codecatagory c where c.catagory='立卷单位') and INDEXID like '%"
				+ indexid + "%'";
		list = jdbc.queryForList(sql);
		return list;

	}

	/**
	 * 资料增加借阅
	 */
	public int insertzlinfo_jy(ZlInfoJy zlinfojy) {
		int flag = 0;
		List<Map> list = new ArrayList();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		// /String
		// sql="select (portion-(select sum(fs) from zl_info_jy where infoid=a.infoid))num from zl_info a where a.infoid='"+zlinfojy.getInfoid()+"'";
		String sql = "select (portion-decode((select sum(fs) from zl_info_jy where infoid=a.infoid),null,0,(select sum(fs) from zl_info_jy where infoid=a.infoid)))num from zl_info a where a.infoid='"
				+ zlinfojy.getInfoid() + "'";

		list = jdbc.queryForList(sql);

		BigDecimal tab = new BigDecimal(0);
		if (list != null && list.size() > 0) {
			Map obj = list.get(0);
			tab = (BigDecimal) obj.get("num") == null ? new BigDecimal(0)
					: (BigDecimal) obj.get("num");
		}
		int d = tab.intValue();
		if (d > 0 && d >= zlinfojy.getFs()) {
			this.zlglDAO.insert(zlinfojy);
			flag = 1;// 借阅成功
		} else {
			flag = 2;// 标识资料不够
		}
		return flag;
	}

	/**
	 * 归还
	 */
	public int insertzlinfo_gh(ZlInfoJy zlinfojy,int fs) {
		int flag = 0;
		try {
			if (zlinfojy.getJysj().before(zlinfojy.getGhsj())
					|| zlinfojy.getJysj().equals(zlinfojy.getGhsj())) {
				JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
				DateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd");
				
				jdbc.update("update zl_info_jy set ghsj= to_date('"
						+ format.format(zlinfojy.getGhsj())
						+ "','yyyy-mm-dd') ,fs='0' ,memo= '上次借阅份数："+fs+"' where uids='" + zlinfojy.getUids()  //,fs='0' ,memo= '前一次借阅份数为"+fs+"'
						+ "'");
				flag = 1;// 归还成功
			} else {
				flag = 2;// 归还时间早于借阅时间
			}
		} catch (Exception e) {
			flag = 0;
			e.printStackTrace();
		}
		return flag;
	}

	/**
	 * 档案归还
	 */
	public int insertdazl_gh(DaZlJy dazljy,int fs) {
		int flag = 0;
		try {
			if (dazljy.getJysj().before(dazljy.getGhsj())
					|| dazljy.getJysj().equals(dazljy.getGhsj())) {
				JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
				DateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd");
				jdbc.update("update da_zl_jy set ghsj= to_date('"
						+ format.format(dazljy.getGhsj())
						+ "','yyyy-mm-dd') ,fs='0' ,memo= '上次借阅份数："+fs+"' where uids='" + dazljy.getUids()
						+ "'");
				flag = 1;// 借阅成功
			} else {
				flag = 2;// 归还时间早于借阅时间
			}
		} catch (Exception e) {
			flag = 0;
			e.printStackTrace();
		}
		return flag;
	}

	/**
	 * 得到续借历史时间
	 */
	public String getxj_history(String uids) {
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List<Map> list = jdbc
				.queryForList("select xjsj  from zl_info_jy where uids='"
						+ uids + "'");
		String re_s = "";
		Map obj = null;
		if (list != null && list.size() > 0) {
			obj = list.get(0);
			re_s = (String) obj.get("xjsj");
		}
		if (re_s != null) {
			re_s = re_s.replaceAll(",", "\n");
		}
		return re_s;
	}

	/**
	 * 得到档案续借历史时间
	 */
	public String getdaxj_history(String uids) {
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List<Map> list = jdbc
				.queryForList("select xjsj  from da_zl_jy where uids='" + uids
						+ "'");
		String re_s = "";
		Map obj = null;
		if (list != null && list.size() > 0) {
			obj = list.get(0);
			re_s = (String) obj.get("xjsj");
		}
		if (re_s != null) {
			re_s = re_s.replaceAll(",", "\n");
		}
		return re_s;
	}

	/* 档案增加借阅 */
	public int insertdazl_jy(DaZlJy dazljy) {
		int flag = 0;
		List<Map> list = new ArrayList();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		// /String
		// sql="select (portion-(select sum(fs) from zl_info_jy where infoid=a.infoid))num from zl_info a where a.infoid='"+zlinfojy.getInfoid()+"'";
		String sql = "select (portion-decode((select sum(fs) from da_zl_jy where infoid=a.infoid),null,0,(select sum(fs) from da_zl_jy where infoid=a.infoid)))num from zl_info a where a.infoid='"
				+ dazljy.getInfoid() + "'";

		list = jdbc.queryForList(sql);

		BigDecimal tab = new BigDecimal(0);
		if (list != null && list.size() > 0) {
			Map obj = list.get(0);
			tab = (BigDecimal) obj.get("num") == null ? new BigDecimal(0)
					: (BigDecimal) obj.get("num");
		}
		int d = tab.intValue();
		if (d > 0 && d >= dazljy.getFs()) {
			this.zlglDAO.insert(dazljy);
			flag = 1;// 借阅成功
		} else {
			flag = 2;// 标识资料不够
		}
		return flag;
	}

	/**
	 * 续借
	 */

	public int update_xj(ZlInfoJy zlinfojy) {
		int flag = 0;
		try {
			DateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd");
			if (zlinfojy.getJysj().before(format.parse(zlinfojy.getXjsj()))
					|| zlinfojy.getJysj().equals(
							format.parse(zlinfojy.getXjsj()))) {
				String xjsj = "";
				if (zlinfojy.getMemo1() != null) {
					xjsj = zlinfojy.getMemo1() + "," + zlinfojy.getXjsj();
				} else {
					xjsj = zlinfojy.getXjsj();
				}
				JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
				jdbc.update("update zl_info_jy set xjsj='" + xjsj
						+ "' ,xjcs=to_number("
						+ (zlinfojy.getXjcs() == null ? 0 : zlinfojy.getXjcs())
						+ ")+1 where uids='" + zlinfojy.getUids() + "'");
				flag = 1;// 续借成功
			} else {
				flag = 2;// 续借时间早于借阅时间
			}
		} catch (Exception e) {
			flag = 0;
			e.printStackTrace();
		}
		return flag;
	}

	/**
	 * 档案续借
	 */

	public int update_daxj(DaZlJy dazljy) {
		int flag = 0;
		try {
			DateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd");
			if (dazljy.getJysj().before(format.parse(dazljy.getXjsj()))
					|| dazljy.getJysj().equals(format.parse(dazljy.getXjsj()))) {
				String xjsj = "";
				if (dazljy.getMemo1() != null) {
					xjsj = dazljy.getMemo1() + "," + dazljy.getXjsj();
				} else {
					xjsj = dazljy.getXjsj();
				}
				JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
				jdbc.update("update da_zl_jy set xjsj='" + xjsj
						+ "' ,xjcs=to_number("
						+ (dazljy.getXjcs() == null ? 0 : dazljy.getXjcs())
						+ ")+1 where uids='" + dazljy.getUids() + "'");
				flag = 1;// 续借成功
			} else {
				flag = 2;// 续借时间早于借阅时间
			}
		} catch (Exception e) {
			flag = 0;
			e.printStackTrace();
		}
		return flag;
	}

	public boolean updateXh(String infoids) {
		boolean flag = false;
		try {
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			String[] uidsArr = infoids.split(",");
			for (int i = 0; i < uidsArr.length; i++) {
				jdbc.update(" update zl_info set billstate='6' where infoid='"
						+ uidsArr[i] + "' ");
			}
			flag = true;
		} catch (Exception e) {
			flag = false;
			e.printStackTrace();
		}
		return flag;
	}

	public boolean updateDaXh(String infoids) {
		boolean flag = false;
		try {
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			String[] uidsArr = infoids.split(",");
			for (int i = 0; i < uidsArr.length; i++) {
				jdbc.update(" update zl_info set billstate='8' where infoid='"
						+ uidsArr[i] + "' ");
			}
			flag = true;
		} catch (Exception e) {
			flag = false;
			e.printStackTrace();
		}
		return flag;
	}

	/* 删除后序号减一 */
	public void daml_xh(String id) {

		String beanNameA = BusinessConstants.Zlgl_PACKAGE
				+ BusinessConstants.DA_Daml;
		DaDaml daml = new DaDaml();
		// 根据对应的id号查找序号
		daml = (DaDaml) this.zlglDAO.findById(beanNameA, id);
		// int Positions=daml.getXh(); //当前记录序列
		String upid; // 序号比当前大一个的记录id
		int maxnum = 0; // 该列表中最大的序列
		try {
			String sql = "select max(xh) from DA_DAML where daid='"
					+ daml.getDaid() + "'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			maxnum = jdbc.queryForInt(sql);
			String upnum;// 上移后的序列号
			List list = this.zlglDAO.findByWhere(beanNameA, "xh<'"
					+ daml.getXh() + "' and  daid='" + daml.getDaid() + "'",
					"xh");
			if (list.size() > 0) {
				DaDaml dadaml;
				for (int i = 0; i < list.size(); i++) {
					dadaml = new DaDaml();
					dadaml = (DaDaml) list.get(list.size() - 1);
					upid = dadaml.getDzid();
					String sql0 = "select xh from DA_DAML where dzid='" + upid
							+ "' and  daid='" + daml.getDaid() + "'";
					upnum = (String) jdbc.queryForObject(sql0, String.class);
					if (daml.getXh() <= maxnum) {
						// 交换2个的序号
						String sql3 = "update DA_DAML set xh='" + upnum
								+ "' where dzid='" + daml.getDzid()
								+ "' and  daid='" + daml.getDaid() + "'";
						String sql4 = "update DA_DAML set xh='" + daml.getXh()
								+ "'  where dzid='" + upid + "' and  daid='"
								+ daml.getDaid() + "'";
						jdbc.update(sql3);
						jdbc.update(sql4);
					}
					break;

				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/*
	 * 制度管理
	 */
	public int deleteZDChildNode(String noid) {
		int flag = 0;
		String beanName = BusinessConstants.Zd_PACKAGE
				+ BusinessConstants.ZD_Tree;
		try {
			ZdTree zdtree = (ZdTree) this.zlglDAO.findById(beanName, noid);
			List list = (List) this.zlglDAO.findByProperty(beanName, "parent",
					zdtree.getParent());
			if (list != null) {
				if (list.size() == 1) { // 删除的节点为该父节点的最后一个
					ZdTree sort = (ZdTree) this.zlglDAO.findById(beanName,
							zdtree.getParent());
					sort.setIsleaf(new Long(1));
					this.UpdateZDtree(sort);
				}
				this.zlglDAO.delete(zdtree);
			} else {
				flag = 1;
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	public int deleteZbwjChildNode(String noid) {
		int flag = 0;
		String beanName = BusinessConstants.Zbwj_PACKAGE
				+ BusinessConstants.Zbwj_Tree;
		try {
			ZbwjTree zbwjtree = (ZbwjTree) this.zlglDAO
					.findById(beanName, noid);
			List list = (List) this.zlglDAO.findByProperty(beanName, "parent",
					zbwjtree.getParent());
			if (list != null) {
				if (list.size() == 1) { // 删除的节点为该父节点的最后一个
					ZbwjTree sort = (ZbwjTree) this.zlglDAO.findById(beanName,
							zbwjtree.getParent());
					sort.setIsleaf(new Long(1));
					this.UpdateZBWJtree(sort);
				}
				this.zlglDAO.delete(zbwjtree);
			} else {
				flag = 1;
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	public List<ColumnTreeNode> ShowZDTree(String parentId)
			throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		StringBuffer bfs = new StringBuffer();
		bfs.append("parent='" + parent);
		bfs.append("' order by indexid ");
		List modules = this.zlglDAO.findByWhere(BusinessConstants.Zd_PACKAGE
				.concat(BusinessConstants.ZD_Tree), bfs.toString());
		Iterator<ZdTree> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			ZdTree temp = (ZdTree) itr.next();
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getTreeid()); // treenode.id
			String aa = temp.getMc() + "(" + temp.getBm() + ")";
			n.setText(aa);
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("icon-pkg"); // treenode.cls
				// n.setIconCls("task-folder"); // treenode.iconCls
			}
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;
	}

	public void SaveZDtree(ZdTree zdtree) {
		// TODO Auto-generated method stub
		this.zlglDAO.insert(zdtree);
	}

	public void SaveZbwjtree(ZbwjTree zbwjtree) {
		// TODO Auto-generated method stub
		this.zlglDAO.insert(zbwjtree);
	}

	public int addOrUpdateZD(ZdTree zdtree, String indexid) {
		int flag = 0;
		String beanName = BusinessConstants.Zd_PACKAGE
				+ BusinessConstants.ZD_Tree;
		try {
			if ("".equals(zdtree.getTreeid())) { // 新增
				/*
				 * 当新增节点是它父节点的第一个子节点，如果该父节点(新 增前是没子节点)原来是[工程量]，就要自动改成[概算]！
				 */
				// 查找是否有同级节点
				List list = (List) this.zlglDAO.findByProperty(beanName,
						"parent", zdtree.getParent());
				if (list.isEmpty()) { // 新增节点是它父节点的第一个子节点
					ZdTree parentBdg = (ZdTree) this.zlglDAO.findById(beanName,
							zdtree.getParent());
					parentBdg.setIsleaf(new Long(0));
					// parentBdg.setOrgid(parentBdg.getOrgid());
					this.UpdateZDtree(parentBdg);
				}
				String str = this.getzdindexid(zdtree.getParent());

				if (str == null || str.equals("")) {
					return 0;
				}
				if (str.substring(str.length() - 1, str.length())
						.equals("9999")) {
					return 1;
				}
				zdtree.setIndexid(str);
				this.SaveZDtree(zdtree);
			} else {
				zdtree.setIndexid(indexid);
				this.UpdateZDtree(zdtree);
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	/*
	 * 招标文件
	 */
	public int addOrUpdateZbwj(ZbwjTree zbwjtree, String indexid) {
		int flag = 0;
		String beanName = BusinessConstants.Zbwj_PACKAGE
				+ BusinessConstants.Zbwj_Tree;
		try {
			if ("".equals(zbwjtree.getTreeid())) { // 新增
				/*
				 * 当新增节点是它父节点的第一个子节点，如果该父节点(新 增前是没子节点)原来是[工程量]，就要自动改成[概算]！
				 */
				// 查找是否有同级节点
				List list = (List) this.zlglDAO.findByProperty(beanName,
						"parent", zbwjtree.getParent());
				if (list.isEmpty()) { // 新增节点是它父节点的第一个子节点
					ZbwjTree parentBdg = (ZbwjTree) this.zlglDAO.findById(
							beanName, zbwjtree.getParent());
					parentBdg.setIsleaf(new Long(0));
					// parentBdg.setOrgid(parentBdg.getOrgid());
					this.UpdateZBWJtree(parentBdg);
				}
				String str = this.getzbindexid(zbwjtree.getParent());

				if (str == null || str.equals("")) {
					return 0;
				}
				if (str.substring(str.length() - 1, str.length())
						.equals("9999")) {
					return 1;
				}
				zbwjtree.setIndexid(str);
				this.SaveZbwjtree(zbwjtree);
			} else {
				zbwjtree.setIndexid(indexid);
				this.UpdateZBWJtree(zbwjtree);
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	/*
	 * 招标文件管理
	 * 
	 * @see
	 * com.sgepit.pmis.document.service.ZlGlMgmFacade#checkzbbh(java.lang.String
	 * )
	 */
	public List<ColumnTreeNode> ShowZBWJTree(String parentId,String pid)
			throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.APPBudgetRootID;
		StringBuffer bfs = new StringBuffer();
		bfs.append("parent='" + parent+"'");
		bfs.append(" and pid='" + pid);   
		bfs.append("' order by indexid ");
		List modules = this.zlglDAO.findByWhere(BusinessConstants.Zbwj_PACKAGE
				.concat(BusinessConstants.Zbwj_Tree), bfs.toString());
		Iterator<ZbwjTree> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			ZbwjTree temp = (ZbwjTree) itr.next();
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getTreeid()); // treenode.id
			String aa = temp.getMc() + "(" + temp.getBm() + ")";
			n.setText(aa);
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("icon-pkg"); // treenode.cls
				// n.setIconCls("task-folder"); // treenode.iconCls
			}
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;
	}

	public boolean checkzbbh(String id) {
		List list = this.zlglDAO.findByProperty(BusinessConstants.Zbwj_PACKAGE
				.concat(BusinessConstants.Zbwj_Gl), "zbbh", id);
		if (list.size() > 0)
			return false;
		return true;
	}

	public String getzbbh(String id) {
		String getzbbh = null;
		ZbwjGl zbwjgl = new ZbwjGl();
		zbwjgl = (ZbwjGl) this.zlglDAO.findById(BusinessConstants.Zbwj_PACKAGE
				.concat(BusinessConstants.Zbwj_Gl), id);
		if (zbwjgl != null) {
			getzbbh = zbwjgl.getZbbh();
			return getzbbh;
		}
		return getzbbh;
	}

	public void savezbwjgl(ZbwjGl zbwjgl) {
		this.zlglDAO.insert(zbwjgl);

	}

	public void updatezbwjgl(ZbwjGl zbwjgl) {
		this.zlglDAO.saveOrUpdate(zbwjgl);
		// TODO Auto-generated method stub

	}

	/**
	 * 获取机构及其所属子机构的资料树
	 * @param parentId 父节点id
	 * @param orgid 机构id
	 * @return
	 */
	public List<ColumnTreeNode> getDeptAndChildZlTree(String parentId,
			String orgid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
        String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
        String whereStr = "parent = '" + parent +"'";
        if ( orgid != null ){
              if ( ! orgid.equals("") ){
                    whereStr += " and orgid in ( select unitid from sgcc_ini_unit t2 start with unitid = '" + orgid + "' connect by prior unitid = upunit )";
              }
        }
        DetachedCriteria criteria = DetachedCriteria.forClass(ZlTree.class);
        criteria.add(Restrictions.sqlRestriction(whereStr));
        criteria.addOrder(Order.asc("indexid"));
        List<ZlTree> modules =zlglDAO.getHibernateTemplate().findByCriteria(criteria);
        
        for (ZlTree zlTree : modules) {
              ColumnTreeNode cn = new ColumnTreeNode();
              TreeNode n = new TreeNode();
              int leaf = zlTree.getIsleaf().intValue();             
              n.setId(zlTree.getTreeid());              // treenode.id
              n.setText(zlTree.getMc());          // treenode.text
              if (leaf == 1) {
                    n.setLeaf(true);                    
                    n.setIconCls("icon-cmp");                 
              } else {
                    n.setLeaf(false);                   // treenode.leaf
                    n.setCls("icon-pkg");         // treenode.cls
                    n.setIconCls("task-folder");      // treenode.iconCls
              }
              cn.setTreenode(n);                              // ColumnTreeNode.treenode
              JSONObject jo = JSONObject.fromObject(zlTree);
              cn.setColumns(jo);                              // columns
              list.add(cn);
        }      
        return list;

	}
	
	public void initDaTree(String pid, String parentId) throws BusinessException{
		//检查当前跟节点下是否没有节点数据
		String whereStr = "pid = '%s' and parent = '%s'";
		whereStr = String.format(whereStr, pid, parentId);
		List tempList = zlglDAO.findByWhere(DaTree.class.getName(), whereStr);
		if ( tempList.size() == 0 ){
			DaTree daTree = new DaTree();
			daTree.setPid(pid);
			daTree.setBm(pid);
			daTree.setMc("档案分类");
			daTree.setIsleaf(1L);
			daTree.setParent(parentId);
			
			zlglDAO.insert(daTree);
			
		}
	}
	
	public void initZlTree(String deptId, String pid, String parentId) throws BusinessException{
		//检查当前跟节点下是否没有节点数据
		String whereStr = "orgid = '%s' and parent = '%s'";
		whereStr = String.format(whereStr, deptId, parentId);
		List tempList = zlglDAO.findByWhere(ZlTree.class.getName(), whereStr);
		if ( tempList.size() == 0 ){
			SgccIniUnit currentUnit = (SgccIniUnit) zlglDAO.findByProperty( SgccIniUnit.class.getName(), "unitid",deptId).get(0);
			PropertyCodeDAO propertyDAO = PropertyCodeDAO.getInstence();
			String deptTypeId = propertyDAO.getCodeValueByPropertyName("部门", "组织机构类型");
			if ( currentUnit.getUnitTypeId().equals(deptTypeId) ){
				//初始化新节点
				ZlTree zlNode = new ZlTree();
				zlNode.setPid(pid);
				zlNode.setBm(deptId);
				zlNode.setIndexid(deptId);
				zlNode.setMc(currentUnit.getUnitname());
				zlNode.setIsleaf(1L);
				zlNode.setOrgid(deptId);
				zlNode.setParent(parentId);
				
				zlglDAO.insert(zlNode);
			}
			
		}	
	}

	public String ZLDAExcelInputData(String pid, String selectdaid,
			FileItem fileItem,String realName) throws IOException, FileUploadException {
		// TODO Auto-generated method stub
		String rtn = "";
		Map<String, String> map = null;
	    try{
	    	Workbook  wb = null;
	    	try{
	    		//导入*.xls文件
	    		InputStream is = fileItem.getInputStream();
	    		wb = new HSSFWorkbook(is);
	    		is.close();
	    	}catch (Exception e) {
	    		//导入*.xlsx文件
	    		InputStream is = fileItem.getInputStream();
	    		wb = new XSSFWorkbook(is);
	    		is.close();
			}
	    	if(wb == null){
	    		return rtn = "{success:false,msg:'上传失败,没有Excel文档！'}";
	    	}else{
	    		Sheet sheet = wb.getSheetAt(0);
	    		Row row = null;
	    		Cell cell = null;
	    		//计数单元格为空的数量
	    		String text = "个单元格未填写，请填写完整,详情如下：</br>";
	    		int count = 0;
	    		//计算excel导入的总页数
	    		int allCount = 0;
	    		//判断是否是对于的excel表
	    		row = sheet.getRow(1);
	    		cell = row.getCell(0);
	    		if(!cell.getStringCellValue().equals("importData")) return rtn = "{success:false,msg:'模板上传错误！请下载模板填写好数据再上传！'}";
	    		//得到excel的总记录条数
	    		int totalRow =  sheet.getLastRowNum();
	    		int numColumn = 0;
	    		Row columnRow = null;// 列配置行，单元格的值与bean的属性对应
	    		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	    		int xhnum=0;
	    		for(int i = 0;i<=totalRow;i++){
	    			if(i==0 || i==1 || i==2) {
	    				if (i == 1){
	    					columnRow = sheet.getRow(i);
	    				}	
	    				continue;
	    			}
	    			int t = i;
	    			row = sheet.getRow(i);
	    			map = new HashMap<String, String>();
	    			if(row != null){
	    				numColumn++;
		    			for(int j = 1;j <=columnRow.getPhysicalNumberOfCells();j++){
		    				cell = row.getCell(j);
		    				if (j==1){
								continue;
							}else {
								String cellValue = null;
								if(cell != null && !cell.toString().equals("")){
									cell.setCellType(1);
									cellValue = cell.getStringCellValue();
								}
								map.put(columnRow.getCell(j).getStringCellValue(),
										cellValue==null?"":cellValue);
							}
		    			}
		    			if(i==0 || i==1 || i==2) continue;
		    			if(i<=totalRow){
			    			ZlInfo zlInfo = new ZlInfo();
			    			zlInfo.setPid(pid);
//			    			zlInfo.setFileno(map.get("dafileno"));
//			    			List<String> companys = this.zlglDAO.getDataAutoCloseSes("SELECT C.PROPERTY_CODE FROM PROPERTY_CODE C WHERE C.PROPERTY_NAME ='" +
//									map.get("company") + "' AND C.TYPE_NAME=(SELECT T.UIDS FROM PROPERTY_TYPE T WHERE T.TYPE_NAME = '责任者')");
//							if(companys == null || companys.size()<1){
//								zlInfo.setWeavecompany("");
//							}else{
//								zlInfo.setWeavecompany(companys.get(0));
//							}
			    			zlInfo.setFileno(map.get("dafileno")==null?"":map.get("dafileno"));
			    			zlInfo.setWeavecompany(map.get("company")==null?"":map.get("company"));
			    			zlInfo.setMaterialname(map.get("dafilename"));
			    			String stockDate = map.get("stockdate");
			    			if(stockDate !=null && !"".equals(stockDate)){
			    				zlInfo.setStockdate(format.parse(stockDate));
			    			}else{
			    				zlInfo.setStockdate(null);
			    			}
			    			zlInfo.setResponpeople(realName);
			    			
			    			zlInfo.setYc(map.get("yc")==null || (map.get("yh") !=null && !"".equals(map.get("yh")))?"0":map.get("yc"));
			    			zlInfo.setQuantity((map.get("yc")==null || "".equals(map.get("yc"))) || (map.get("yh") !=null && !"".equals(map.get("yh")))?0:Long.parseLong(map.get("yc")));
			    			zlInfo.setYh(map.get("yh")==null?"":map.get("yh"));
			    			if(map.get("rkrq") !=null && !"".equals(map.get("rkrq"))){
			    				zlInfo.setRkrq(format.parse(map.get("rkrq")));
			    			}else{
			    				zlInfo.setRkrq(null);
			    			}
			    			zlInfo.setYjr(map.get("yjr")==null?"":map.get("yjr"));
			    			zlInfo.setJsr(map.get("jsr")==null?"":map.get("jsr"));
			    			zlInfo.setRemark(map.get("bz")==null?"":map.get("bz"));
			    			this.zlglDAO.insert(zlInfo);
						    
							//获取DA_DAML中序号的最大值
							List getXH =JdbcUtil.query("select max(xh) as xh from da_daml where pid='"+pid+"'");
							Map map1 = (Map) getXH.get(0);
							Object objXH = map.get("xh");
							DaDaml daDaml = new DaDaml();
							String sql = "select count(*) from Da_Daml where daid='" + selectdaid+ "'";
							JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
							xhnum = jdbc.queryForInt(sql);
							xhnum++;
							daDaml.setXh(new Long(xhnum));
							daDaml.setPid(pid);
							daDaml.setZlid(zlInfo.getInfoid());
							daDaml.setDaid(selectdaid);
							if(map.get("sl") !=null && !"".equals(map.get("sl"))){
								daDaml.setSl(Long.parseLong(map.get("sl")));
			    			}else{
			    				daDaml.setSl(null);
			    			}
							daDaml.setYc(zlInfo.getYc());
							daDaml.setYh(zlInfo.getYh());
							daDaml.setStockdate(zlInfo.getStockdate());
							this.zlglDAO.insert(daDaml);
		    			}
	    			}else if(row == null){
	    				continue;
	    			}
	    		}
	    		//修改总页数的值
	    		 JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
	    		 String yc = null;// 页号
	    			yc = getzlyc(selectdaid);
	    		 String updataYs = " update da_zl t set t.zys = " +yc+
			           " where t.daid ='"+selectdaid+"'";
	             jdbc.update(updataYs);
	    		 return rtn = "{success:true,msg:'上传成功！'}";
	    	}
	    }catch(Exception e){
	    	e.printStackTrace();
	    	return rtn = "{success:false,msg:'上传失败'}";
	    }
	}
	
	/**
	 * 获得这个资料的所有大对象流水号信息
	 * @param infoid
	 * @author: Liuay
	 * @createDate: 2012-10-17
	 */
	public String getZlFileLshs(String infoid){
		List<ZlInfoBlobList> blobLists = this.zlglDAO.findByWhere(ZlInfoBlobList.class.getName(), "infoid='" + infoid + "'");
		String returnStr = "";
		if (blobLists.size()>0) {
			ZlInfoBlobList blobList ;
			for (int i = 0; i < blobLists.size(); i++) {
				blobList = blobLists.get(i);
				returnStr += "`" + blobList.getFilelsh();
			}
			if (returnStr.length()>0) {
				return returnStr.substring(1);
			}
		}
		return "";
	}
	/**
	 * @param dzidNo
	 * @param selectdaid
	 * @param getPxh
	 * 修改更新序号
	 */
	public void updateXH(String dzidNo,String selectdaid,Long getPxh,Long firstXh ){
		   JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		   String updateXh1="";
		   String updateXH2 = "update da_daml set xh='"+getPxh+"' where daid='"+selectdaid+"' and dzid='"+dzidNo+"'";
		   //更新大于选择要修改记录修改的序号
		   if(getPxh<firstXh){
		       updateXh1 = "update da_daml set xh=(xh+1) where daid='"+selectdaid+"' and xh>="+getPxh+"  and xh<"+firstXh;

		   }else{
			   updateXh1 = "update da_daml set xh=(xh-1) where daid='"+selectdaid+"' and xh>="+firstXh+"  and xh<="+getPxh;    
		   }
		   //更新选择要修改记录的序号
	       jdbc.update(updateXh1);
	       jdbc.update(updateXH2);
	}

	public int insertda_jy(DaZlJy dazljy) {
		// TODO Auto-generated method stub
		int flag = 0;
		List<Map> list = new ArrayList();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		// /String
		// sql="select (portion-(select sum(fs) from zl_info_jy where infoid=a.infoid))num from zl_info a where a.infoid='"+zlinfojy.getInfoid()+"'";
		String sql = "select (kcfs-decode((select sum(fs) from da_zl_jy where infoid = a.daid),null,  0, (select sum(fs) from da_zl_jy where infoid = a.daid))) num  from da_zl a where a.daid ='"
				+ dazljy.getInfoid() + "'";

		list = jdbc.queryForList(sql);
        String whereSql = "select dh, mc from da_zl  t where t.daid='"+dazljy.getInfoid()+"'";
        List<Map> list1 = jdbc.queryForList(whereSql);
        Map<String,String>  map = list1.get(0);
        if(map.get("DH")==null){
        	dazljy.setDh("");
        }else{
        	dazljy.setDh(map.get("DH").toString());
        }
        if(map.get("MC") == null){
        	dazljy.setMc("");
        }else{
        	dazljy.setMc(map.get("MC").toString());
        }
        
        BigDecimal tab = new BigDecimal(0);
		if (list != null && list.size() > 0) {
			Map obj = list.get(0);
			tab = (BigDecimal) obj.get("num") == null ? new BigDecimal(0)
					: (BigDecimal) obj.get("num");
		}
		int d = tab.intValue();
		if (d > 0 && d >= dazljy.getFs()) {
			this.zlglDAO.insert(dazljy);
			flag = 1;// 借阅成功
		} else {
			flag = 2;// 标识资料不够
		}
		return flag;
	}
	
	/**
	 * 根据sql查询cell需要展现的数据；
	 * @param sql
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-11-28
	 */
	public List getListForCellBySql(String sql){
		List list = new ArrayList();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		list = jdbc.queryForList(sql);
		return list;
	}
	
	public String getFileidByBusinessType(String businessType){
		String templateSql = "select fileid from app_template t where templatecode='"
			+ businessType + "' order by lastmodify desc";
		List<Map<String, String>> l = JdbcUtil.query(templateSql);
		String templateFileId = "";
		if (l.size() > 0) {
			templateFileId = l.get(0).get("fileid");
		}
		return templateFileId;
	}
	
}




