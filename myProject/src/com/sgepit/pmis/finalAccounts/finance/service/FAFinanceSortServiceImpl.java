package com.sgepit.pmis.finalAccounts.finance.service;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pmis.finalAccounts.finance.dao.FAFinanceDAO;
import com.sgepit.pmis.finalAccounts.finance.hbm.FASubjectSort;
import com.sgepit.pmis.finalAccounts.finance.hbm.FaFinBalance;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaMatAuditReport;

public class FAFinanceSortServiceImpl implements FAFinanceSortService{
	
	private FAFinanceDAO faFinanceDAO;
	
	public FAFinanceDAO getFaFinanceDAO() {
		return faFinanceDAO;
	}

	public void setFaFinanceDAO(FAFinanceDAO faFinanceDAO) {
		this.faFinanceDAO = faFinanceDAO;
	}
///////////////////////////////////////////////////财务科目分类维护
	
	public void deleteSubjectSort(FASubjectSort fss) throws SQLException,BusinessException {
		this.faFinanceDAO.delete(fss);
	}
	
	public void insertSubjectSort(FASubjectSort fss) throws SQLException,BusinessException {
		this.faFinanceDAO.insert(fss);
	}
	
	public void updateSubjectSort(FASubjectSort fss) throws SQLException,BusinessException {
		this.faFinanceDAO.saveOrUpdate(fss);
	}
	
	public int addOrUpdateSubject(FASubjectSort fss){
		int flag = 0;
		try {
			if ("".equals(fss.getUids())){   //  新增
				List list = (List)this.faFinanceDAO.findByProperty(FASubjectSort.class.getName(), "parent", fss.getParent());
				if (list.isEmpty()){
					FASubjectSort parentSort = (FASubjectSort)this.faFinanceDAO.findById(FASubjectSort.class.getName(), fss.getParent());
					parentSort.setIsLeaf(Boolean.FALSE);
					this.updateSubjectSort(parentSort);
				}
				this.insertSubjectSort(fss);
			}else{
				  this.updateSubjectSort(fss);
			}
		} catch (SQLException e) {
			flag = 1; 
			e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; 
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 删除 一个科目分类
	 * @return
	 */
	public int deleteChildNodeSubject(String subId){
		FASubjectSort fss = (FASubjectSort)this.faFinanceDAO.findById(FASubjectSort.class.getName(), subId);
		String parentId = fss.getParent();
		List list = (List)this.faFinanceDAO.findByProperty(FASubjectSort.class.getName(), "parent", parentId);
		
		try {
			if (!"0".equals(parentId)){
				this.deleteSubjectSort(fss);
				if (list.size() == 1){
					this.deleteChildNodeSubject(parentId);
				}
			}
		} catch (BusinessException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			 e.printStackTrace();
		}
		
		return 0;
	}
	
	/*
	 * 获得财务科目选择树
	 */
	public List<ColumnTreeNode> getSubjectSortTree(String parentId, String whereStr) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: Constant.APPBudgetRootID;
		
		/*
		List<FASubjectSort> subjectSorts = faFinanceDAO.findByProperty(FASubjectSort.class
				.getName(), "parent", parent, "subNo");
		*/
		String sql = "select * from fa_subject_sort where parent = '" + parentId + "' ";
		if (whereStr!=null && whereStr.length()>0) {
			sql += " and uids in (select distinct uids from fa_subject_sort " +
				" start with uids in (select uids from fa_subject_sort where " + whereStr + ") connect by prior parent=uids)";
		}
		Session ses = HibernateSessionFactory.getSession();
		SQLQuery query = ses.createSQLQuery(sql).addEntity(FASubjectSort.class);
		List<FASubjectSort> subjectSorts = query.list();
		
		for (FASubjectSort sort : subjectSorts) {
			ColumnTreeNode columnTreeNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			boolean leaf = sort.getIsLeaf();

			if (leaf) {
				node.setLeaf(true);
				node.setIconCls("task");
			} else {
				node.setLeaf(false); // treenode.leaf
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			columnTreeNode.setTreenode(node);
			JSONObject jo = JSONObject.fromObject(sort);

			// UIProvider
			String uiProvider = "col";

			jo.accumulate("uiProvider", uiProvider);

			columnTreeNode.setColumns(jo); // columns
			list.add(columnTreeNode);
		}

		return list;
		
	}

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
		//财务科目树		
		if ( treeName.equalsIgnoreCase("subjectSortSelectTree") ){
			String[] whereArr = (String[]) params.get("whereStr");
			String whereStr = "";
			if (whereArr!=null && whereArr.length>0) {
				whereStr = new String(whereArr[0]);
			}
			return getSubjectSortTree(parentId, whereStr);
		} else if (treeName.equalsIgnoreCase("subjectSortTree")) {
			String[] pidArr = (String[]) params.get("pid");
			String pid = "";
			if (pidArr!=null && pidArr.length>0) {
				pid = pidArr[0];
			}
			return this.subjectSortTree(parentId, pid);   
		}    
		
		return null;
	}
	
	private List<ColumnTreeNode> subjectSortTree(String parentId, String pid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: Constant.APPBudgetRootID;
		String str = "parent='"+ parent +"' and pid = '" + pid + "' order by subNo";
		List<FASubjectSort> objects = this.faFinanceDAO.findByWhere(FASubjectSort.class.getName(), str);
		Iterator<FASubjectSort> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			FASubjectSort temp = (FASubjectSort) itr.next();
			boolean leaf = temp.getIsLeaf().booleanValue();
			n.setId(temp.getUids());			// treenode.id
			n.setText(temp.getSubName());		// treenode.text
			n.setLeaf(leaf);				
			if (leaf) {
				n.setIconCls("icon-cmp");			
			} else {
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	    // treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	
	public List<FASubjectSort> getBdgSubjects(String bdgid, String sortColumn, boolean asc){
		DetachedCriteria criteria = DetachedCriteria.forClass(FASubjectSort.class);
		criteria.add(Restrictions.sqlRestriction(" bdgid in (select bdgid from bdg_info start with bdgid = '" + bdgid + "' connect by prior bdgid = parent )"));
		if ( asc ){
			
			criteria.addOrder(Order.asc(sortColumn));
		}
		else{
			criteria.addOrder(Order.desc(sortColumn));
		}
		
		
		return faFinanceDAO.getHibernateTemplate().findByCriteria(criteria);
		
	}

	public void setSubjectsRefBdg(String[] subjectIds, String bdgid) throws BusinessException{
		String inStr = transStrForSqlIn(subjectIds);
		String sql = "update fa_subject_sort set bdgid = '%s' where uids in %s and is_leaf <> 0";
		sql = String.format(sql, bdgid, inStr);
		if ( bdgid == null ){
			sql = "update fa_subject_sort set bdgid = null where uids in %s";
			sql = String.format(sql, inStr);
		} 
		
		JdbcUtil.update(sql);
		
	}
	
	/**
	 * 将字符串转换成sql语句中in所需要的字符串
	 * 
	 * @param oriStr
	 *            原始串
	 * @param spStr
	 *            分隔符
	 * @return 返回需要的串
	 */
	private String transStrForSqlIn(String[] oriStrArr) {
		String rtnStr = "(";
	
		for (int i = 0; i < oriStrArr.length; i++) {
			rtnStr += "'" + oriStrArr[i] + "',";
		}
		return rtnStr.substring(0, rtnStr.length() - 1) + ")";
	}

	
	/**
	 * 二次费用分摊操作
	 * @param tableName	分摊资产的表名
	 * @param ids		分摊资产的uids
	 * @param subNo		分摊的财务科目编码
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 19, 2011
	 */
	public String apportionSecond(String tableName, String ids, String subNo){
//		计算分摊比例列
		String column1Name = "";
//		分摊到对应比例列
		String column2Name = "";
//		分摊的具体物资编码的表列
		String objectCol = "";
		if (tableName.equalsIgnoreCase("FA_BUILDING_AUDIT_REPORT")) {
			column1Name = "BUILDING_AMOUNT";
			column2Name = "APPORTION_AMOUNT";
		} else if(tableName.equalsIgnoreCase("FA_MAT_AUDIT_REPORT")){
		} else if(tableName.equalsIgnoreCase("FA_EQU_AUDIT_REPORT")){
			column1Name = "EQU_AMOUNT";
			column2Name = "EQU_OTHER_AMOUNT";
			objectCol = "EQU_ID";
		}
		
//		获取选中财务科目的期末余额
		List<FaFinBalance> list = this.faFinanceDAO.findByProperty(FaFinBalance.class.getName(), "subNo", subNo);
//		将选中科目财务数据分摊到设备、房建的资产上
		if (list.size()>0) {
			FaFinBalance finBalance = list.get(0);
			BigDecimal endBalance = finBalance.getTermEndBalance();
			if (endBalance!=null && endBalance.compareTo(BigDecimal.ZERO)!=0) {
				if (column1Name.length()>0 && column2Name.length()>0) {
					String idInStr = StringUtil.transStrToIn(ids, "`");
					String whereSql = " where uids in (" + idInStr + ")";
					String sumSql = "select sum(" + column1Name + ") from " + tableName + whereSql;
					String updateSql = "";
//					合计值的重新计算
					String updateSql2 = "";
					String whereSql2 = whereSql;
					if(objectCol.length()>0) {
						whereSql2 = " where uids in (select uids from " + tableName + " where " + objectCol + " in " +
								"( select " + objectCol + " from " + tableName + whereSql + "))";
					}
					updateSql = "update " + tableName + " set " + column2Name + "= " + column1Name + "*" + endBalance.toPlainString() + "/(" + sumSql + ")" + whereSql2;
					if (tableName.equalsIgnoreCase("FA_BUILDING_AUDIT_REPORT")) {
						updateSql2 = "update FA_BUILDING_AUDIT_REPORT set amount = nvl(building_amount, 0) + nvl(APPORTION_AMOUNT, 0)" + whereSql2;
					}
					if (tableName.equalsIgnoreCase("FA_EQU_AUDIT_REPORT")) {
						updateSql2 = "update fa_equ_audit_report set amount = nvl(equ_amount, 0) + nvl(equ_base_amount, 0) + nvl(equ_install_amount,0)+ nvl(equ_other_amount, 0)" + whereSql2;
					}
					System.out.println("updateSql::" + updateSql);
					System.out.println("updateSql2::" + updateSql2);
					
					JdbcUtil.update(updateSql);
					if (updateSql2.length()>0) {
						JdbcUtil.update(updateSql2);
					}
				}
				
//				记录分摊的日志信息
				String[] idArr = ids.split("`");
				for (int i = 0; i < idArr.length; i++) {
					String insertSql = "insert into FA_FIN_APPORTION2_LOG (uids, pid, sub_no, audit_report_id, table_name, operate_time) " +
							"values('" + SnUtil.getNewID() + "', 'GJMD', '" + subNo + "', '" + idArr[i] + "', '" + tableName + "', sysdate)";
					JdbcUtil.execute(insertSql);
				}
			}
		}
		return "OK";
	}
	
	/**
	 * 直接形成固定资产操作
	 * @param tableName	稽核业务表名
	 * @param ids	稽核资产数据uids
	 * @param subNo	财务套账号
	 * @return
	 * @author: Liuay
	 * @createDate: 2011-7-21
	 */
	public String fixAssetsDirect(String tableName, String ids, String accountId){
		//检查该套账好是否已对应到其它资产
		String accountAssetsSql = "select count(*) cnt from FA_FIN_FIXASSETSDIRECT_LOG where account_id = '%s' and assets_no <> '%s'";
		accountAssetsSql = String.format(accountAssetsSql, accountId, ids);
		List<Map<String, Object>> result = JdbcUtil.query(accountAssetsSql);
		if ( Integer.valueOf(result.get(0).get("cnt").toString()) != 0 ){
			return "ACCOUNT_ALREADY_USED";
		}
		//财务科目的的期末余额对应到物资资产的固定资产金额
		FaFinBalance balance = (FaFinBalance) faFinanceDAO.findByProperty(FaFinBalance.class.getName(), "accountId", accountId).get(0);
		FaMatAuditReport faMatAuditReport = (FaMatAuditReport) faFinanceDAO.findById(FaMatAuditReport.class.getName(), ids);
		faMatAuditReport.setFinFixedAmount(balance.getTermEndBalance());
		faFinanceDAO.saveOrUpdate(faMatAuditReport);
		
		//删除原有的固定资产对照
		String delDirectSql = "delete from FA_FIN_FIXASSETSDIRECT_LOG where assets_no = '%s'";
		delDirectSql = String.format(delDirectSql, ids);
		JdbcUtil.update(delDirectSql);
		//添加新的固定资产对照
		String insertSql = "insert into FA_FIN_FIXASSETSDIRECT_LOG (UIDS, PID, ACCOUNT_ID, ASSETS_NO, OPERATE_TIME)" +
				" values ( '" + SnUtil.getNewID() + "','" + balance.getPid() + "', '" + accountId + "', '" + ids + "', sysdate)";
		JdbcUtil.update(insertSql);
		return "SUCCESS";
	}
}
