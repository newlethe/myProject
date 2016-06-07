package com.sgepit.pcmis.balance.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pcmis.balance.dao.PCBalanceDAO;
import com.sgepit.pcmis.balance.hbm.PcBalanceSortTree;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
public class PCBalanceServiceImpl extends BaseMgmImpl implements PCBalanceService {
	
	private PCBalanceDAO pcBalanceDAO;
	
	public PCBalanceDAO getPcBalanceDAO() {
		return pcBalanceDAO;
	}
	
	public void setPcBalanceDAO(PCBalanceDAO pcBalanceDAO) {
		this.pcBalanceDAO = pcBalanceDAO;
	}
	
	/**
	 *  获得结算结构 - 树
	 *  扩展的treeGrid
	 */
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> balanceManagerTree(String orderBy,Integer start, Integer limit, HashMap map) {
		List<PcBalanceSortTree> list = new ArrayList();
		String  parent=(String)map.get("parent");
		String pid=(String)map.get("pid");
	    list = pcBalanceDAO.findByWhere2(PcBalanceSortTree.class.getName(), "parent='"+parent+"' and pid='"+pid+"'");
	    List newList=DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}
	
	/**
	 * 插入一条结算信息
	 * @param balanceInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void insertBalanceInfo(PcBalanceSortTree balanceInfo) throws SQLException,BusinessException {
		this.pcBalanceDAO.insert(balanceInfo);
	}
	
	/**
	 * 更新当前结算记录
	 * @param balanceInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void updateBalanceInfo(PcBalanceSortTree balanceInfo) throws SQLException,BusinessException {
		this.pcBalanceDAO.saveOrUpdate(balanceInfo);
	}
	
	/**
	 * 概算结构维护 - 新增、修改节点
	 * @param bdgInfo
	 * @return 1新增或修改成功,0新增或修改失败,-1费用编号已被使用
	 * @throws SQLException 
	 * @throws BusinessException 
	 */
	@SuppressWarnings("unchecked")
	public int addOrUpdateBalanceInfo(PcBalanceSortTree balanceInfo){
		int flag = 0;
		//判断编号是否已经被使用
		if(!this.balancnoIsOnly(balanceInfo))
		{
			flag = -1;
			return flag;
		}
		String beanName = "com.sgepit.pcmis.balance.hbm.PcBalanceSortTree";
		String where =" pid='"+balanceInfo.getPid()+"' and balanceno='"+balanceInfo.getBalanceNo()+"' ";
		List balanceBeans = pcBalanceDAO.findByWhere(beanName, where);
		try{
			if(balanceBeans.isEmpty())  //新增记录
			{
				upDateParentBalanceInfo(balanceInfo, "add", null);
				//获得上级费用信息并更新isleaf字段
				List<PcBalanceSortTree> parentBeanList = pcBalanceDAO.findByWhere2(beanName,
								"pid='"+balanceInfo.getPid()+"' and balanceno='"+balanceInfo.getParent()+"'");
				if(!parentBeanList.isEmpty())
				{
					PcBalanceSortTree parentBalanceInfo = parentBeanList.get(0);
					parentBalanceInfo.setIsleaf(new Long(0));
					this.updateBalanceInfo(parentBalanceInfo);
				}
				
				this.insertBalanceInfo(balanceInfo);
			}
			else                       //修改记录
			{
				PcBalanceSortTree oldBalanceBean = (PcBalanceSortTree) balanceBeans.get(0);
				upDateParentBalanceInfo(balanceInfo,"update", oldBalanceBean);
				oldBalanceBean.setBalanceName(balanceInfo.getBalanceName());
				oldBalanceBean.setBalanceNo(balanceInfo.getBalanceNo());
				oldBalanceBean.setCoMoney(balanceInfo.getCoMoney());
				oldBalanceBean.setConstructionCost(balanceInfo.getConstructionCost());
				//前台不可以编辑下面三个属性
//				oldBalanceBean.setIsleaf(balanceInfo.getIsleaf());
//				oldBalanceBean.setParent(balanceInfo.getParent());
//				oldBalanceBean.setPid(balanceInfo.getPid());
				this.updateBalanceInfo(oldBalanceBean);
			}
			
			flag = 1;
		}catch(Exception e){
			flag = 0;
			e.printStackTrace();
		}

		return flag;
	}
	
	/**
	 * 概算结构维护 - 删除一条费用信息
	 * @param uids 主键值
	 * @return flag 删除返回标志: 0为成功，1为失败
	 * @throws SQLException 
	 * @throws BusinessException 
	 */
	@SuppressWarnings("unchecked")
	public int deleteBalanceInfo(String uids) throws BusinessException, SQLException{
		int flag = 0; 
		String beanName = "com.sgepit.pcmis.balance.hbm.PcBalanceSortTree";
		try{
			PcBalanceSortTree balanceBean = (PcBalanceSortTree)this.pcBalanceDAO.findById(beanName, uids);  //待删除bean
			
			String pid = balanceBean.getPid();
			String parentBalanceNo = balanceBean.getParent();
			
			//更新父记录的isleaf字段信息
			String whereSql = "pid='" + pid + "' and parent='" + parentBalanceNo + "'";
			List beanList = this.pcBalanceDAO.findByWhere2(beanName, whereSql);
			if(!beanList.isEmpty())
			{
				if(beanList.size()==1)
				{
					List list = this.pcBalanceDAO.findByWhere2(beanName, 
													"pid='"+pid+"' and balanceno='"+parentBalanceNo+"'");
					PcBalanceSortTree parentBalanceBean = (PcBalanceSortTree) list.get(0);
					parentBalanceBean.setIsleaf(new Long(1));
					this.updateBalanceInfo(parentBalanceBean);
				}
				
			}
			
			//逐层更新待删除记录父记录的工程总价, 已付金额字段
			upDateParentBalanceInfo(balanceBean, "delete", null);
			this.pcBalanceDAO.delete(balanceBean);
			flag = 1;
		}catch(Exception e){
			flag = 0;
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 子节点更新后更新父记录工程总价,已完成金额字段
	 * @param balanceInfo 前台传递的新增或者修改后的对象
	 * @param method  更具是新增, 修改, 还是删除来判断父记录更新字段的方式
	 * @param oldBalanceBean 当修改结算记录是已经保存在数据库中的该记录对象
	 * @throws SQLException 
	 * @throws BusinessException 
	 */
	@SuppressWarnings("unchecked")
	public void upDateParentBalanceInfo(PcBalanceSortTree balanceInfo, String method, 
										PcBalanceSortTree oldBalanceBean) throws BusinessException, SQLException
	{
		String beanName = "com.sgepit.pcmis.balance.hbm.PcBalanceSortTree";
		String sql = "select distinct uids from pc_balance_sort where pid='"+balanceInfo.getPid()+
									"' connect by prior parent=balanceno start with balanceno='"+balanceInfo.getParent()+"'";
		List<String> list = pcBalanceDAO.getDataAutoCloseSes(sql);
		if(!list.isEmpty())
		{	
			for(int i=0; i<list.size();i++)
			{
				PcBalanceSortTree bean  = (PcBalanceSortTree)this.pcBalanceDAO.findById(beanName,list.get(i));
				if(method.equals("add")) //新增或者修改记录,更新父记录信息
				{	
					bean.setConstructionCost(bean.getConstructionCost() + balanceInfo.getConstructionCost());
					bean.setCoMoney(bean.getCoMoney() + balanceInfo.getCoMoney());
				}
				else if(method.equals("update"))   //修改记录, 更新父记录
				{
					bean.setConstructionCost(bean.getConstructionCost() + 
									balanceInfo.getConstructionCost() - oldBalanceBean.getConstructionCost());
					bean.setCoMoney(bean.getCoMoney() + 
									balanceInfo.getCoMoney() - oldBalanceBean.getCoMoney());
				}	
				else  //删除记录更新父记录
				{
					bean.setConstructionCost(bean.getConstructionCost() - balanceInfo.getConstructionCost());
					bean.setCoMoney(bean.getCoMoney() - balanceInfo.getCoMoney());
				}
				this.updateBalanceInfo(bean);
			}
		}
	}
	/**
	 * 功能: 在新增一条记录的时候判断项目编号+费用编号是否唯一(1--编号未被使用, 0--编号已经被使用)
	 * @param balanceInfo
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public boolean balancnoIsOnly(PcBalanceSortTree balanceInfo){
		String balanceno = balanceInfo.getBalanceNo();
		String pid = balanceInfo.getPid();
		String beanName = "com.sgepit.pcmis.balance.hbm.PcBalanceSortTree";
		List list = this.pcBalanceDAO.findByWhere2(beanName, "pid='"+pid+", and balanceno="+balanceno+"'");
		if(list.isEmpty())
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}
