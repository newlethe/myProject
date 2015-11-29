package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.dao.BidBdgApportionDAO;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BidBdgApportion;
import com.sgepit.pmis.budget.hbm.BidBdgInfo;
import com.sgepit.pmis.budget.hbm.OtherCompletionSub;
import com.sgepit.pmis.common.BusinessConstants;

/**多项目招标管理 ，招标概算分摊接口实现类
 * @author tengri
 *
 */
@SuppressWarnings("all")
public class BidBdgApportionMgmImpl extends BaseMgmImpl implements BidBdgApportionMgmFacade {
	
	private BidBdgApportionDAO  bidBdgApportionDao;

	public BidBdgApportionDAO getBidBdgApportionDao() {
		return bidBdgApportionDao;
	}

	public void setBidBdgApportionDao(BidBdgApportionDAO bidBdgApportionDao) {
		this.bidBdgApportionDao = bidBdgApportionDao;
	}

	@Override
	public void deleteOthComp(OtherCompletionSub othComp) throws SQLException,
			BusinessException {
		this.bidBdgApportionDao.delete(othComp);
	}

	@Override
	public void insertOthComp(OtherCompletionSub othComp) throws SQLException,
			BusinessException {
		this.bidBdgApportionDao.insert(othComp);
	}

	@Override
	public void updateOthComp(OtherCompletionSub othComp) throws SQLException,
			BusinessException {
		this.bidBdgApportionDao.saveOrUpdate(othComp);
	}

	@Override
	public List<ColumnTreeNode> getOtherTree(String parentId, String id)
			throws BusinessException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<ColumnTreeNode> otherCompTree(String parentId, String id)
			throws BusinessException {
		// TODO Auto-generated method stub
		return null;
	}
	
	/*
	 *招标概算树（被选择的树）treeGrid
	 */
	public List<ColumnTreeNode> getZbgsTree(String orderBy,Integer start, Integer limit, HashMap map) throws BusinessException {
		List<BidBdgInfo> resultList = new ArrayList<BidBdgInfo>();
	       //页面定义处的参数
		String  parentId=(String)map.get("parent");
	       //页面定义处的参数
		String contId=(String)map.get("conid");
		String pid=(String)map.get("pid");
	       //拼装一般查询语句		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent = '%s' and pid = '%s' order by bdgid";
		str = String.format(str, parent, pid);
		List<BidBdgInfo> objects = this.bidBdgApportionDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("BidBdgInfo"), str);
		Iterator<BidBdgInfo> itr = objects.iterator();
		
		//把已经勾选的设置为选中状态
		while (itr.hasNext()) {
			BidBdgInfo temp = (BidBdgInfo) itr.next();
			List lt = this.bidBdgApportionDao.findByWhere(BusinessConstants.BDG_PACKAGE.concat("BidBdgApportion"),
					"contentId = '" + contId + "' and bdgid = '"+ temp.getBdgid() + "'");
			if (lt != null && lt.size() > 0) {
				temp.setIscheck(true);
			} 
			resultList.add(temp);
		}
		List newList=DynamicDataUtil.changeisLeaf(resultList, "isleaf");
		return newList;
	}


	/**招标概算分摊树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 * @throws BusinessException
	 */
	@Override
	public List<ColumnTreeNode> bidBdgApportionTree(String orderBy,Integer start, Integer limit, HashMap map) throws BusinessException {
		String parentId = (String) map.get("parent");
		String conId = (String) map.get("conid");
		String where = "parentId = '%s' and contentId ='%s' order by bdgId";
		where = String.format(where, parentId,conId);
		String beanName = BusinessConstants.BDG_PACKAGE.concat("BidBdgApportion");
		List<BidBdgApportion>  list = this.bidBdgApportionDao.findByWhere(beanName, where);
		Iterator<BidBdgApportion> iterator = list.iterator();
		
		List newList=DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList; 
	}

	/**保存选择 的子树
	 * @param zbUids 招标申请主键
	 * @param conid 招标内容主键
	 * @param ids  选中tree的id集合
	 */
	@Override
	public void saveGetZbgsTree(String zbUids,String conid, String[] ids) {
		String pid = "";
		for(int i = 0 ; i< ids.length;i++){
			BidBdgApportion bba = new BidBdgApportion();
			String[] strs = ids[i].split("~");
			BidBdgInfo info = (BidBdgInfo) this.bidBdgApportionDao.findById(BusinessConstants.BDG_PACKAGE.concat("BidBdgInfo"), strs[0]);
			pid = info.getPid();
			String where = "bdgid = '" +info.getBdgid() + "' and contentId='" + conid+ "'";
			String beanName = BusinessConstants.BDG_PACKAGE.concat("BidBdgApportion");
			List list = this.bidBdgApportionDao.findByWhere(beanName, where);
			if(list.size() == 0){ //已经添加过的节点不再继续添加
				bba.setPid(pid);
				bba.setZbUids(zbUids);
				bba.setContentId(conid);
				bba.setBdgId(info.getBdgid());
				bba.setBdgName(info.getBdgname());
				bba.setBdgNo(info.getBdgno());
				bba.setBdgMoney(info.getBdgmoney());
				bba.setParentId(info.getParent());
				bba.setIsleaf(info.getIsleaf());
				bba.setPlanBgMoney(0);
				bba.setZbgsMoney(Double.parseDouble(strs[1]));
				this.bidBdgApportionDao.insert(bba);
				String sql = "update pc_bid_bdg_apportion t set t.zbgs_money = '"+Double.parseDouble(strs[1])+"' where " +
						" t.bdgid = '"+bba.getBdgId()+"'";
				JdbcUtil.update(sql);
			}
		}
	}

	@Override
	public int delChildNodeBidBdgApportion(String uids) throws Exception {
		int flag = 0; // 删除返回标志: 0为成功，1为失败
		String beanName = BusinessConstants.BDG_PACKAGE.concat("BidBdgApportion");
		BidBdgApportion app = (BidBdgApportion) this.bidBdgApportionDao.findById(beanName, uids);
		//查询要删除节点的兄弟节点，如果兄弟节点只有一个（自身），那么要同时删除对应的父节点
		String parentId = app.getParentId();
		String where = "parentId ='"+ parentId +"' and contentId= '" + app.getContentId() + "'";
		List list = this.bidBdgApportionDao.findByWhere(beanName, where);
		try {
			if (!"0".equals(app.getBdgId())){
				this.bidBdgApportionDao.delete(app);
				this.reCalcOldPlanMoney(app,"delete",null);
				if (list.size() == 1){
					String strParent = "bdgId = '" + app.getParentId() + "' and contentId= '"	+ app.getContentId() + "'";
					List listPa = (List) this.bidBdgApportionDao.findByWhere(beanName, strParent);
					if (listPa.size() > 0){
						BidBdgApportion parnetApp =(BidBdgApportion) listPa.get(0);
						this.delChildNodeBidBdgApportion(parnetApp.getUids());
					}
				}
			}else{
				flag = 1;
			}
		}catch (Exception e) {
			flag = 1; 
			e.printStackTrace();
		}
		return flag;
	}

	/**重新计算操作节点所有父节点对应的【本次计划概算金额】
	 * @param app  操作节点对象
	 * @param flag  标示是删除操作还是修改操作
	 * @param value  操作节点的本次招标计划概算金额
	 * @throws Exception
	 */
	@Override
	public void reCalcOldPlanMoney(BidBdgApportion app, String flag,String value)throws Exception {
		String contentId = app.getContentId();
		String bdgId = app.getBdgId();
		double planMoney = app.getPlanBgMoney();
		String pSql = "select tt.uids from (select t.uids, t.bdgid, t.parentid from pc_bid_bdg_apportion t where " +
				" t.content_id = '"+contentId+"') tt start with tt.bdgid = '"+bdgId+"'" +
				" connect by prior  tt.parentid = tt.bdgid";
		planMoney = "delete".equals(flag) ? (planMoney = planMoney * -1 ):( Double.parseDouble(value) - planMoney); 
		String sql = "update  pc_bid_bdg_apportion t set t.plan_bgmoney = t.plan_bgmoney + "+planMoney+" where t.uids in ("+pSql+")";
		JdbcUtil.update(sql);
	}

	/**更新本次计划概算金额
	 * @param uids  本次节点主键id
	 * @param value  修改后的值
	 * @throws Exception
	 */
	@Override
	public void updatePlanBgMoney(String uids, String value) throws Exception {
		String beanName = BusinessConstants.BDG_PACKAGE.concat("BidBdgApportion");
		BidBdgApportion app = (BidBdgApportion) this.bidBdgApportionDao.findById(beanName, uids);
		this.reCalcOldPlanMoney(app,"update",value);
		double planBgMoney = Double.parseDouble(value);
		app.setPlanBgMoney(planBgMoney);
		this.bidBdgApportionDao.saveOrUpdate(app);
	}

}
