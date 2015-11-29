package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.pmis.budget.dao.BdgCorpDAO;
import com.sgepit.pmis.budget.hbm.BdgCorpBasic;
import com.sgepit.pmis.budget.hbm.BdgCorpInfo;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.common.BusinessConstants;

public class BdgCorpMgmImpl extends BaseMgmImpl implements BdgCorpMgmFacade {

	private BdgCorpDAO bdgCorpDao;

	private BusinessException businessException;
	private Object[][] object;
	
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static BdgCorpMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (BdgCorpMgmImpl) ctx.getBean("bdgCorpMgm");
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	public void setBdgCorpDao(BdgCorpDAO bdgCorpDao) {
		this.bdgCorpDao = bdgCorpDao;
	}
	
	public String insertBdgCorpBasic(BdgCorpBasic bdgcorpbasic) throws SQLException, 
			BusinessException {
		String state = "";
		try {
			this.bdgCorpDao.insert(bdgcorpbasic);
		} catch (RuntimeException e) {
			e.printStackTrace(); state = "数据保存失败！"; return state;
		}
		return state;
	}
	
	public String updateBdgCorpBasic(BdgCorpBasic bdgcorpbasic) throws SQLException, 
			BusinessException {
		String state = "";
		try {
			this.bdgCorpDao.saveOrUpdate(bdgcorpbasic);
		} catch (RuntimeException e) {
			e.printStackTrace(); state = "数据保存失败！"; return state;
		}
		return state;
	}
	
	/**
	 * @description 删除建设法人管理主表信息
	 * @author Xiaos
	 * @param bdgcorpbasicid 建设法人管理ID
	 * @exception SQLException, BusinessException
	 * @return flag 0:成功 1:失败
	 */
	public int deleteBdgCorpBasic(String bdgcorpbasicid) throws SQLException,
			BusinessException {
		int flag = 0;
		try {
			//先删除子表数据
			String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_CORP_INFO;
			List corpInfoList = this.bdgCorpDao.findByProperty(beanName, "basicid", bdgcorpbasicid);
			if (!corpInfoList.isEmpty())
				this.bdgCorpDao.deleteAll(corpInfoList);
			//再删除主表数据
			String basicBeanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_CORP_BASIC;
			BdgCorpBasic corpBasic = (BdgCorpBasic)this.bdgCorpDao.findById(basicBeanName, bdgcorpbasicid);
			this.bdgCorpDao.delete(corpBasic);
		} catch (RuntimeException e) {
			e.printStackTrace(); flag = 1; return flag;
		}
		return flag;
	}
	
	public void insertBdgCorpInfo(BdgCorpInfo corpinfo) throws SQLException,
			BusinessException {
		this.bdgCorpDao.insert(corpinfo);
	}
	
	public void updateBdgCorpInfo(BdgCorpInfo corpinfo) throws SQLException,
			BusinessException {
		this.bdgCorpDao.saveOrUpdate(corpinfo);
	}
	
	/**   
	 * @description建设法人管理获得概算树
	 * @author Xiaos
	 * @param parentId
	 * @return sbf
	 */
	public String getCorpBudgetTree(String parentId, String basicid) throws BusinessException {
		StringBuffer sbf = new StringBuffer("[");
		try {
			String parent = parentId != null ? parentId
					: BusinessConstants.APPBudgetRootID;
			List modules = this.bdgCorpDao.findByProperty(
					BusinessConstants.BDG_PACKAGE
							.concat(BusinessConstants.BDG_INFO), "parent", parent);
			
			Iterator itr = modules.iterator();
			while (itr.hasNext()) {
				BdgInfo temp = (BdgInfo) itr.next();
				int leaf = temp.getIsleaf().intValue();
				String bo = "";
				List l = this.bdgCorpDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CORP_INFO),
						"basicid = '" + basicid + "' and bdgid = '"+ temp.getBdgid() + "'");

				if (leaf == 1 && l != null && l.size() > 0) {
					bo = "true";
				}
				
				sbf.append("{bdgid:\"");
				sbf.append(temp.getBdgid());
				sbf.append("\",pid:\"");
				sbf.append(temp.getPid());
				sbf.append("\",bdgno:\"");
				sbf.append(temp.getBdgno());
				sbf.append("\",bdgname:\"");
				sbf.append(temp.getBdgname());
				sbf.append("\",bdgflag:");
				sbf.append(temp.getBdgflag());
				sbf.append(",bdgmoney:");
				sbf.append(temp.getBdgmoney());
				sbf.append(",matrmoney:");
				sbf.append(temp.getMatrmoney());
				sbf.append(",buildmoney:");
				sbf.append(temp.getBuildmoney());
				sbf.append(",equmoney:");
				sbf.append(temp.getEqumoney());
				sbf.append(",isleaf:");
				sbf.append(temp.getIsleaf());
				sbf.append(",parent:\"");
				sbf.append(temp.getParent());
				
				sbf.append("\",uiProvider:\"col\"");
				if (0 == leaf) {
					sbf.append(",cls:\"master-task\",ischeck:\"" + bo
							+ "\",iconCls:\"task-folder\"");
					sbf.append(",children:");
					sbf.append(getCorpBudgetTree(temp.getBdgid(), basicid));
				} else {
					sbf.append(",ischeck:\"" + bo
							+ "\",iconCls:\"task\",leaf:true");
				}
				sbf.append("}");
				if (itr.hasNext()) {
					sbf.append(",");
				}
			}
			sbf.append("]");
		} catch (Exception e) {
			throw new BusinessException(e.getMessage());
		}
		System.out.println("-------->:"+sbf.toString());
		return sbf.toString();
	}
	
	/**
	 * @description 保存选择的树
	 * @author Xiaos
	 * @param corpbasicid
	 * @param ids
	 */
	public void saveGetBudgetTree(String corpbasicid, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			BdgCorpInfo bci = new BdgCorpInfo();
			
			BdgInfo bdgInfo = (BdgInfo) this.bdgCorpDao.findById(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), ids[i]);
			
			if (bdgInfo.getIsleaf() == 0){
				String str = "bdgid = '" +bdgInfo.getBdgid() + "' and basicid='" + corpbasicid+ "'";
				List list = (List) this.bdgCorpDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_CORP_INFO), str);
				if (list.size() > 0) continue ;
			}
			
			bci.setPid(bdgInfo.getPid());
			bci.setBdgid(bdgInfo.getBdgid());
			bci.setBasicid(corpbasicid);
			bci.setIsleaf(bdgInfo.getIsleaf());
			bci.setParent(bdgInfo.getParent());
			bdgCorpDao.insert(bci);
		}
	}
	
	/**
	 * @description 获得从概算树选择后的建设法人概算树
	 * @author Xiaos
	 * @param parentId
	 * @param corpbasicid
	 */
	public String corpInfoTree(String parentId, String corpbasicid) 
			throws BusinessException {
		StringBuffer sbf = new StringBuffer("[");
		try {
			String parent = parentId != null ? parentId
					: BusinessConstants.APPBudgetRootID;
		
			String str = "parent = '" + parent + "' and corpbasicid = '" + corpbasicid +"'";
		
			List list = this.bdgCorpDao.findByWhere(
					BusinessConstants.BDG_PACKAGE
							.concat(BusinessConstants.BDG_CORP_INFO), str);
		
			BdgCorpInfo bma = null;
		
			List bmaExtlist = new ArrayList();
		
			for (int i = 0; i < list.size(); i++) {
				bma = new BdgCorpInfo();
		
				bma = (BdgCorpInfo) list.get(i);
		
				BdgInfo bi = (BdgInfo) this.bdgCorpDao.findById(
						BusinessConstants.BDG_PACKAGE
								.concat(BusinessConstants.BDG_INFO), bma.getBdgid());
				bma.setBdgmoney(bi.getBdgmoney());
				bma.setBdgno(bi.getBdgno());
				bma.setBdgname(bi.getBdgname());
				bmaExtlist.add(bma);
				
			}
			
			Iterator itr = bmaExtlist.iterator();
			while (itr.hasNext()) {
				BdgCorpInfo temp = (BdgCorpInfo) itr.next();
				
				int leaf = temp.getIsleaf().intValue();
		
				sbf.append("{bdgid:\"");
				sbf.append(temp.getBdgid());
				///////////
				
		
				sbf.append("\",basicid:\"");
				sbf.append(temp.getBasicid());
				
				///////////////////
				
				sbf.append("\",pid:\"");
				sbf.append(temp.getPid());
				sbf.append("\",corpid:\"");
				sbf.append(temp.getCorpid());
				sbf.append("\",bdgno:\"");
				sbf.append(temp.getBdgno());
				//sbf.append("\",appmoney:");
				sbf.append("\",appmoney:");
				Double appmoney = temp.getAppmoney();
				if (appmoney == null){
					appmoney = new Double(0); 
				}
				sbf.append(appmoney);
				
				//sbf.append(temp.getAppmoney());
				sbf.append(",bdgmoney:");
				Double bdgmoney = temp.getBdgmoney();
				if (bdgmoney == null){
					bdgmoney = new Double(0); 
				}
				sbf.append(bdgmoney);
				sbf.append(",bdgname:\"");
				sbf.append(temp.getBdgname());
				sbf.append("\",corpremark:\"");
				sbf.append(temp.getCorpremark());
				sbf.append("\",isleaf:");
				sbf.append(temp.getIsleaf());
				sbf.append(",parent:\"");
				sbf.append(temp.getParent());
				sbf.append("\",uiProvider:\"col\"");
				if (0 == leaf) {
					sbf.append(",cls:\"master-task\",iconCls:\"task-folder\"");
					sbf.append(",children:");
					
					System.out.println("------------------------:"+temp.getBdgid());
					
					sbf.append(corpInfoTree(temp.getBdgid(),corpbasicid));
				} else {
					sbf.append(",iconCls:\"task\",leaf:true");
				}
				sbf.append("}");
				if (itr.hasNext()) {
					sbf.append(",");
				}
			}
			sbf.append("]");
		} catch (Exception e) {
			e.printStackTrace();
			throw new BusinessException(e.getMessage());
		}
		
		return sbf.toString();
	}
	
	/**
	 * @description 保存建设法人对编辑数据
	 * @author Xiaos
	 * @param bdgCorpInfo
	 */
	public int addOrUpdateBdgCorpInfo(BdgCorpInfo bdgCorpInfo){
		int flag = 0;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_CORP_INFO;
		try {
			if ("".equals(bdgCorpInfo.getCorpid())&& (bdgCorpInfo.getCorpid() == null)){
				List list = (List)this.bdgCorpDao.findByProperty(beanName, "parent", bdgCorpInfo.getParent());
				if (list.isEmpty()){
					BdgCorpInfo parentBdg = (BdgCorpInfo)this.bdgCorpDao.findById(beanName, bdgCorpInfo.getParent());
					parentBdg.setIsleaf(new Long(0));
					this.updateBdgCorpInfo(parentBdg);
				}
			}else{
				this.updateBdgCorpInfo(bdgCorpInfo);
				
			}
			sumBdgCorpInfo(bdgCorpInfo.getParent(),bdgCorpInfo.getBasicid());
		} catch (SQLException e) {
			flag = 1; e.printStackTrace();
		} catch (BusinessException e) {
			flag = 1; e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * @description 建设法人概算金额统计(编辑时)
	 * @author Xiaos
	 * @param parentId
	 * @param basicid
	 * @throws SQLException, BusinessException
	 */
	public void sumBdgCorpInfo(String parentId, String basicid) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_CORP_INFO;
		String str = "parent = '" + parentId + "' and basicid= '" + basicid + "'";
		List list = (List)this.bdgCorpDao.findByWhere(beanName, str);
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgCorpInfo bci = (BdgCorpInfo) iterator.next();
			Double d = bci.getAppmoney();
			if (d == null){
				d = new Double(0);
			}
			db += d;
		}
		String strParent = "bdgid = '" + parentId + "' and basicid= '" + basicid + "'";
		List  list3= (List)this.bdgCorpDao.findByWhere(beanName, strParent);
		BdgCorpInfo parentInfo =(BdgCorpInfo)list3.get(0);
		parentInfo.setAppmoney(db);
		this.updateBdgCorpInfo(parentInfo);
		
		if (!"0".equals(parentInfo.getParent()))
			sumBdgCorpInfo(parentInfo.getParent(), basicid);
	}
	
	public int deleteChildNodeBdgCorpInfo(String corpid) throws SQLException, BusinessException{
		int flag = 1;
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_CORP_INFO;
		BdgCorpInfo bci = (BdgCorpInfo) this.bdgCorpDao.findById(beanName, corpid);

		// 查询记录不存在返回失败
		if (bci == null) return 1;

		// 删除记录，并且改变节点统计金额
		this.bdgCorpDao.delete(bci);
		
		//父节点本身直接删除
		if(bci.getParent().equals("0")) return 0;
		
		//得到父节点容器
		String strParent = "bdgid = '" + bci.getParent() + "' and basicid= '" + bci.getBasicid() + "'";
		List list = (List) this.bdgCorpDao.findByWhere(beanName, strParent);
		BdgCorpInfo bciParent = (BdgCorpInfo) list.get(0);
		
		if(bciParent.getParent().equals("0")){
			if(null == bciParent.getAppmoney()) bciParent.setAppmoney(new Double("0"));
			if(null == bci.getAppmoney()) bci.setAppmoney(new Double("0"));
			Double r = bciParent.getAppmoney() - bci.getAppmoney();
			bciParent.setAppmoney(r);	
		}else{
			this.sumBdgCorpInfoForDelete(bci);
		}
		
		flag = 0;

		// 查询这条记录父节点有几条子记录
		String strKid = "parent = '" + bciParent.getBdgid() + "' and basicid= '" + bci.getBasicid() + "'";	
		List listKid = (List) this.bdgCorpDao.findByWhere(beanName, strKid);

		//如果父节点对应子记录不存在，则传父节点id进行递归
		if (listKid.size() == 0) {
			this.deleteChildNodeBdgCorpInfo(bciParent.getCorpid());
		}

		// 返回标志
		return flag;
	}
	
	public void sumBdgCorpInfoForDelete(BdgCorpInfo bci) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_CORP_INFO;
		String str = "parent = '" + bci.getParent() + "' and basicid= '" + bci.getBasicid() + "'";
		List list = (List)this.bdgCorpDao.findByWhere(beanName, str);
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgCorpInfo obj_bdgInfo = (BdgCorpInfo) iterator.next();
			if (obj_bdgInfo.getBdgid().equals(bci.getBdgid())) continue;
			if (null != obj_bdgInfo.getAppmoney())
			db += obj_bdgInfo.getAppmoney();
		}
		String strParent = "bdgid = '" +  bci.getParent() + "' and basicid= '" +  bci.getBasicid() + "'";
		List  list3= (List)this.bdgCorpDao.findByWhere(beanName, strParent);
		
		if (list3.size() > 0){
			BdgCorpInfo parentInfo =(BdgCorpInfo)list3.get(0);
			parentInfo.setAppmoney(db);
			this.updateBdgCorpInfo(parentInfo);
			this.sumBdgCorpInfo(parentInfo.getParent(),parentInfo.getBasicid());
		}
		
	}
}
