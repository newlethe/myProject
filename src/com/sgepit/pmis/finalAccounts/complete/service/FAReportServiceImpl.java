package com.sgepit.pmis.finalAccounts.complete.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.collections.map.ListOrderedMap;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.contract.hbm.ConOveView;
import com.sgepit.pmis.contract.hbm.ConPartyb;
import com.sgepit.pmis.finalAccounts.complete.dao.FACompleteDAO;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompBdgInfo;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompFixedAssetTree;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompBdgInfoReport2;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompDtfyContDetail3;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompEquWzBmInv;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedAsset;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostReport3;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompTransferAssetsR4;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompTransferAssetsR41;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompTransferAssetsR42;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompTransferAssetsR43;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompTransferAssetsR44;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompTransferAssetsR4View;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompWxzcCqdtAsset;

/**
 * @author qiupy 2013-7-24 
 *
 */
public class FAReportServiceImpl extends BaseMgmImpl implements FAReportService {

	private FACompleteDAO faCompleteDAO;
	/**
	 * 固定资产分类编码
	 */
	public final static String FIXED_ASSET_TYPE_GDZC_ROOT="01";//固定资产分类根节点
	public final static String FIXED_ASSET_TYPE_SCYGDZC="0101";//生产用固定资产
	public final static String FIXED_ASSET_TYPE_SB_JZ="";//土建--设备基座
	public final static String FIXED_ASSET_TYPE_TJ_FW="010101";//土建--房屋
	public final static String FIXED_ASSET_TYPE_TJ_JZWANDGZW="010102";//土建--建筑物和构筑物
	public final static String FIXED_ASSET_TYPE_SB_NEED_SB="010103";//设备--需安装设备
	public final static String FIXED_ASSET_TYPE_SB_UN_NEED_SB="010104";//设备--不需安装设备
	public final static String FIXED_ASSET_TYPE_GQJ_AND_JJ="010105";//生产用固定资产--工器具及家具
	public final static String FIXED_ASSET_TYPE_LDZC="0102";//流动资产
	public final static String FIXED_ASSET_TYPE_LDZC_GQJ="010201";//流动资产--工器具
	public final static String FIXED_ASSET_TYPE_LDZC_JJ="010202";//流动资产--家具
	public final static String FIXED_ASSET_TYPE_LDZC_BPBJ="010203";//流动资产--备品备件
	public final static String FIXED_ASSET_TYPE_WXZC="0103";//无形资产
	public final static String FIXED_ASSET_TYPE_CQDT="0104";//长期待摊

	public FAReportServiceImpl() {
		super();
	}

	public FAReportServiceImpl(FACompleteDAO faCompleteDAO) {
		super();
		this.faCompleteDAO = faCompleteDAO;
	}

	public FACompleteDAO getFaCompleteDAO() {
		return faCompleteDAO;
	}

	public void setFaCompleteDAO(FACompleteDAO faCompleteDAO) {
		this.faCompleteDAO = faCompleteDAO;
	}
	
	/**
	 * 通过session获取pid，可以不从前台传递
	 * @return
	 * @author zhangh 2013-7-30
	 */
	public String getPid() {
		String pid = "";
		WebContext webContext = WebContextFactory.get();    
		if(webContext!=null){
			HttpSession session = webContext.getSession() ;
			pid = session.getAttribute(Constant.CURRENTAPPPID).toString(); 
		}
		return pid;
	}
	
	/**
	 * 初始化竣工竣工决算一览表（竣建02表）
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 */
	@SuppressWarnings("unchecked")
	public String initFacompBdgInfoReport2(Boolean force,String pid){
		if (!force) {
			List<FacompBdgInfoReport2> repList = faCompleteDAO.findByWhere(FacompBdgInfoReport2.class.getName(), "pid='"+pid+"'");
			if (repList.size() > 0) {
				return "1";
			}else{
				return "0";
			}
		}
		String sql = "delete from FACOMP_BDG_INFO_REPORT_2 where pid = '" + pid + "'";
		JdbcUtil.update(sql);
		List<FACompBdgInfo> faBdgList=this.faCompleteDAO.findByWhere(FACompBdgInfo.class.getName(), "pid='"+pid+"'");
		List<String> parentIdList = new ArrayList<String>();
		if(faBdgList!=null&&faBdgList.size()>0){
			for(int i=0;i<faBdgList.size();i++){
				FACompBdgInfo fabdg=faBdgList.get(i);
				FacompBdgInfoReport2 fabcr3=new FacompBdgInfoReport2();
				fabcr3.setPid(pid);
				fabcr3.setTreeid(pid + "-" + fabdg.getTreeid());
				fabcr3.setBdgno(fabdg.getBdgno());
				fabcr3.setBdgname(fabdg.getBdgname());
				fabcr3.setIsleaf(fabdg.getIsleaf());
				fabcr3.setParentid(pid + "-" + fabdg.getParentid());
				if(fabdg.getIsleaf()==1){
					String sql1="select nvl(buildbdgmoney,0) buildbdgmoney,nvl(equipbdgmoney,0) equipbdgmoney,nvl(installbdgmoney,0) installbdgmoney" +
							",nvl(otherbdgmoney,0) otherbdgmoney,nvl(buildprojectmoney,0) buildprojectmoney,nvl(buildclmoney,0) buildclmoney" +
							",nvl(buildbdgsbjzmoney,0) buildbdgsbjzmoney,nvl(installprojectmoney,0) installprojectmoney,nvl(installclmoney,0) installclmoney" +
							",nvl(equipbuymoney,0) equipbuymoney,nvl(othercostmoney,0) othercostmoney,nvl(buildsbjzmoney,0) buildsbjzmoney" +
							" from Facomp_Bdg_Info_R2_VIEW where treeid='"+fabdg.getTreeid()+"' and pid='"+pid+"'";
					List<Map<String, BigDecimal>> l = JdbcUtil.query(sql1);
					Iterator<Map<String, BigDecimal>> it = l.iterator();
					BigDecimal buildbdgmoney=new BigDecimal(0);
					BigDecimal equipbdgmoney=new BigDecimal(0);
					BigDecimal installbdgmoney=new BigDecimal(0);
					BigDecimal otherbdgmoney=new BigDecimal(0);
					BigDecimal buildprojectmoney=new BigDecimal(0);
					BigDecimal buildclmoney=new BigDecimal(0);
					BigDecimal buildbdgsbjzmoney=new BigDecimal(0);
					BigDecimal installprojectmoney=new BigDecimal(0);
					BigDecimal installclmoney=new BigDecimal(0);
					BigDecimal equipbuymoney=new BigDecimal(0);
					BigDecimal othercostmoney=new BigDecimal(0);
					BigDecimal buildrealsbjzmoney=new BigDecimal(0);
					while (it.hasNext()) {
						Map<String, BigDecimal> map = it.next();
						buildbdgmoney=map.get("buildbdgmoney".toUpperCase());
						equipbdgmoney=map.get("equipbdgmoney".toUpperCase());
						installbdgmoney=map.get("installbdgmoney".toUpperCase());
						otherbdgmoney=map.get("otherbdgmoney".toUpperCase());
						buildprojectmoney=map.get("buildprojectmoney".toUpperCase());
						buildclmoney=map.get("buildclmoney".toUpperCase());
						buildbdgsbjzmoney=map.get("buildbdgsbjzmoney".toUpperCase());
						installprojectmoney=map.get("installprojectmoney".toUpperCase());
						installclmoney=map.get("installclmoney".toUpperCase());
						equipbuymoney=map.get("equipbuymoney".toUpperCase());
						othercostmoney=map.get("othercostmoney".toUpperCase());
						buildrealsbjzmoney=map.get("buildsbjzmoney".toUpperCase());
					}
					BigDecimal bdg_money_total=buildbdgmoney.add(equipbdgmoney).add(installbdgmoney).add(otherbdgmoney);
					BigDecimal build_money_total=buildprojectmoney.add(buildclmoney);
					BigDecimal install_money_total=installprojectmoney.add(installclmoney);
					BigDecimal other_money_total=othercostmoney;
					BigDecimal real_money_total=build_money_total.add(install_money_total).add(other_money_total);
					BigDecimal upordown_money=real_money_total.subtract(bdg_money_total);
					BigDecimal upordown_rate=new BigDecimal(0);
					if (bdg_money_total.compareTo(new BigDecimal(0)) != 0) {
						upordown_rate = upordown_money.divide(bdg_money_total, 4, BigDecimal.ROUND_HALF_UP)
								.multiply(new BigDecimal(100)).setScale(2, BigDecimal.ROUND_HALF_UP);
					}
					fabcr3.setBuildbdgmoney(buildbdgmoney.doubleValue());
					fabcr3.setEquipbdgmoney(equipbdgmoney.doubleValue());
					fabcr3.setInstallbdgmoney(installbdgmoney.doubleValue());
					fabcr3.setOtherbdgmoney(otherbdgmoney.doubleValue());
					fabcr3.setBdgMoneyTotal(bdg_money_total.doubleValue());
					fabcr3.setBuildbdgsbjzmoney(buildbdgsbjzmoney.doubleValue());
					fabcr3.setBuildMoneyTotal(build_money_total.doubleValue());
					fabcr3.setBuildrealsbjzmoney(buildrealsbjzmoney.doubleValue());
					fabcr3.setInstallMoneyTotal(install_money_total.doubleValue());
					fabcr3.setEquipbuymoney(equipbuymoney.doubleValue());
					fabcr3.setOtherMoneyTotal(other_money_total.doubleValue());
					fabcr3.setRealMoneyTotal(real_money_total.doubleValue());
					fabcr3.setUpordownMoney(upordown_money.doubleValue());
					fabcr3.setUpordownRate(upordown_rate.toString()+"%");
					String parentId = fabcr3.getParentid();
					if (!parentIdList.contains(parentId)) {
						parentIdList.add(parentId);
					}
				}
				this.faCompleteDAO.saveOrUpdate(fabcr3);
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumMoneyHandler(iterator.next(),pid);
			}
			addSumItemsForReport2(pid);
		}
		return "1";
	}

	@SuppressWarnings("unchecked")
	public void addSumItemsForReport2(String pid){
		List<FacompBdgInfoReport2> repList = faCompleteDAO.findByWhere(FacompBdgInfoReport2.class.getName(),
				"treeid='" + pid + "-01' and pid='" + pid + "'");
		if (repList!=null&&repList.size() > 0) {
			FacompBdgInfoReport2 fabcr3=(FacompBdgInfoReport2) repList.get(0);
			FacompBdgInfoReport2 fabcr32=new FacompBdgInfoReport2();
			fabcr32.setPid(pid);
			fabcr32.setTreeid(pid+"-019998");
			fabcr32.setBdgname("合计");
			fabcr32.setIsleaf(1L);
			fabcr32.setParentid(pid+"-01");
			fabcr32.setBuildbdgmoney(fabcr3.getBuildbdgmoney());
			fabcr32.setEquipbdgmoney(fabcr3.getEquipbdgmoney());
			fabcr32.setInstallbdgmoney(fabcr3.getInstallbdgmoney());
			fabcr32.setOtherbdgmoney(fabcr3.getOtherbdgmoney());
			fabcr32.setBdgMoneyTotal(fabcr3.getBdgMoneyTotal());
			fabcr32.setBuildMoneyTotal(fabcr3.getBuildMoneyTotal());
			fabcr32.setEquipbuymoney(fabcr3.getEquipbuymoney());
			fabcr32.setBuildbdgsbjzmoney(fabcr3.getBuildbdgsbjzmoney());
			fabcr32.setBuildrealsbjzmoney(fabcr3.getBuildrealsbjzmoney());
			fabcr32.setInstallMoneyTotal(fabcr3.getInstallMoneyTotal());
			fabcr32.setOtherMoneyTotal(fabcr3.getOtherMoneyTotal());
			fabcr32.setRealMoneyTotal(fabcr3.getRealMoneyTotal());
			fabcr32.setUpordownMoney(fabcr3.getUpordownMoney());
			fabcr32.setUpordownRate(fabcr3.getUpordownRate());
			this.faCompleteDAO.saveOrUpdate(fabcr32);
		}
		FacompBdgInfoReport2 fabcr=new FacompBdgInfoReport2();
		fabcr.setPid(pid);
		fabcr.setTreeid(pid+"-019999");
		fabcr.setBdgname("其中：预计未完工程");
		fabcr.setIsleaf(1L);
		fabcr.setParentid(pid+"-01");
		String sql="select nvl(sum(d.predunbuild),0) buildbdgmoney,nvl(sum(d.equippurch),0) equipbdgmoney,nvl(sum(d.installeng),0) installbdgmoney," +
				"nvl(sum(d.othercost),0) otherbdgmoney,nvl(sum(d.totalmoney),0) bdgmoneytotal from facomp_uncomp_prj d group by d.pid";
		List<Map<String, BigDecimal>> l = JdbcUtil.query(sql);
		Iterator<Map<String, BigDecimal>> it = l.iterator();
		BigDecimal buildbdgmoney=new BigDecimal(0);
		BigDecimal equipbdgmoney=new BigDecimal(0);
		BigDecimal installbdgmoney=new BigDecimal(0);
		BigDecimal otherbdgmoney=new BigDecimal(0);
		BigDecimal bdgmoneytotal=new BigDecimal(0);
		while (it.hasNext()) {
			Map<String, BigDecimal> map = it.next();
			buildbdgmoney=map.get("buildbdgmoney".toUpperCase());
			equipbdgmoney=map.get("equipbdgmoney".toUpperCase());
			installbdgmoney=map.get("installbdgmoney".toUpperCase());
			otherbdgmoney=map.get("otherbdgmoney".toUpperCase());
			bdgmoneytotal=map.get("bdgmoneytotal".toUpperCase());
		}
		fabcr.setBuildbdgmoney(buildbdgmoney.doubleValue());
		fabcr.setEquipbdgmoney(equipbdgmoney.doubleValue());
		fabcr.setInstallbdgmoney(installbdgmoney.doubleValue());
		fabcr.setOtherbdgmoney(otherbdgmoney.doubleValue());
		fabcr.setBdgMoneyTotal(bdgmoneytotal.doubleValue());
		this.faCompleteDAO.saveOrUpdate(fabcr);
	}

	/**
	 * 汇总父节点数据
	 * @param parentId
	 * @return void
	 * @throws
	 */
	@SuppressWarnings("unchecked")
	private void sumMoneyHandler(String parentId,String pid){
		Double buildbdgmoney=new Double(0);
		Double equipbdgmoney=new Double(0);
		Double installbdgmoney=new Double(0);
		Double otherbdgmoney=new Double(0);
		Double buildbdgsbjzmoney=new Double(0);
		Double buildrealsbjzmoney=new Double(0);
		Double equipbuymoney=new Double(0);
		Double bdgMoneyTotal=new Double(0);
		Double buildMoneyTotal=new Double(0);
		Double installMoneyTotal=new Double(0);
		Double otherMoneyTotal=new Double(0);
		Double realMoneyTotal=new Double(0);
		Double upordownMoney=new Double(0);
		BigDecimal upordownRate=new BigDecimal(0);
		String beanName=FacompBdgInfoReport2.class.getName();
		List<FacompBdgInfoReport2> list = this.faCompleteDAO.findByWhere(beanName, "parentid='"+parentId+"' and pid='"+pid+"'");
		for (Iterator<FacompBdgInfoReport2> iterator = list.iterator(); iterator.hasNext();) {
			FacompBdgInfoReport2 fabcr3 = iterator.next();
			buildbdgmoney+=fabcr3.getBuildbdgmoney()==null?new Double(0):fabcr3.getBuildbdgmoney();
			equipbdgmoney+=fabcr3.getEquipbdgmoney()==null?new Double(0):fabcr3.getEquipbdgmoney();
			installbdgmoney+=fabcr3.getInstallbdgmoney()==null?new Double(0):fabcr3.getInstallbdgmoney();
			otherbdgmoney+=fabcr3.getOtherbdgmoney()==null?new Double(0):fabcr3.getOtherbdgmoney();
			buildbdgsbjzmoney+=fabcr3.getBuildbdgsbjzmoney()==null?new Double(0):fabcr3.getBuildbdgsbjzmoney();
			buildrealsbjzmoney+=fabcr3.getBuildrealsbjzmoney()==null?new Double(0):fabcr3.getBuildrealsbjzmoney();
			equipbuymoney+=fabcr3.getEquipbuymoney()==null?new Double(0):fabcr3.getEquipbuymoney();
			bdgMoneyTotal+=fabcr3.getBdgMoneyTotal()==null?new Double(0):fabcr3.getBdgMoneyTotal();
			buildMoneyTotal+=fabcr3.getBuildMoneyTotal()==null?new Double(0):fabcr3.getBuildMoneyTotal();
			installMoneyTotal+=fabcr3.getInstallMoneyTotal()==null?new Double(0):fabcr3.getInstallMoneyTotal();
			otherMoneyTotal+=fabcr3.getOtherMoneyTotal()==null?new Double(0):fabcr3.getOtherMoneyTotal();
			realMoneyTotal+=fabcr3.getRealMoneyTotal()==null?new Double(0):fabcr3.getRealMoneyTotal();
			upordownMoney+=fabcr3.getUpordownMoney()==null?new Double(0):fabcr3.getUpordownMoney();
		}
		List<FacompBdgInfoReport2> parentInfoList = this.faCompleteDAO.findByWhere(beanName, "treeid='"+parentId+"' and pid='"+pid+"'");
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompBdgInfoReport2 parentInfo=parentInfoList.get(0);
			parentInfo.setBuildbdgmoney(buildbdgmoney.doubleValue());
			parentInfo.setEquipbdgmoney(equipbdgmoney.doubleValue());
			parentInfo.setInstallbdgmoney(installbdgmoney.doubleValue());
			parentInfo.setOtherbdgmoney(otherbdgmoney.doubleValue());
			parentInfo.setBdgMoneyTotal(bdgMoneyTotal.doubleValue());
			parentInfo.setBuildMoneyTotal(buildMoneyTotal.doubleValue());
			parentInfo.setInstallMoneyTotal(installMoneyTotal.doubleValue());
			parentInfo.setEquipbuymoney(equipbuymoney.doubleValue());
			parentInfo.setBuildbdgsbjzmoney(buildbdgsbjzmoney.doubleValue());
			parentInfo.setBuildrealsbjzmoney(buildrealsbjzmoney.doubleValue());
			parentInfo.setOtherMoneyTotal(otherMoneyTotal.doubleValue());
			parentInfo.setRealMoneyTotal(realMoneyTotal.doubleValue());
			parentInfo.setUpordownMoney(upordownMoney.doubleValue());
			BigDecimal bdg_money_total=new BigDecimal(bdgMoneyTotal);
			BigDecimal upordown_money=new BigDecimal(upordownMoney);
			if (bdg_money_total.compareTo(new BigDecimal(0)) != 0) {
				upordownRate = upordown_money.divide(bdg_money_total, 4, BigDecimal.ROUND_HALF_UP)
						.multiply(new BigDecimal(100)).setScale(2, BigDecimal.ROUND_HALF_UP);
			}
			parentInfo.setUpordownRate(upordownRate.toString()+"%");
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!((pid+"-0").equals(parentInfo.getParentid()))) {
				sumMoneyHandler(parentInfo.getParentid(),pid);
			}
		}
	}

	/**
	 * 移交资产总表(竣建04表)
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />
	 *            如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 * @return String
	 * @author qiupy 2013-8-1
	 */
	@SuppressWarnings("unchecked")
	public String initFacompTransferAssetsR4(Boolean force,String pid){
		if (!force) {
			List<FacompTransferAssetsR4> repList = faCompleteDAO.findByWhere(FacompTransferAssetsR4.class.getName(), "pid='" + pid + "'");
			if (repList.size() > 0) {
				return "1";
			}else{
				return "0";
			}
		}
		String sql = "delete from FACOMP_TRANSFER_ASSETS_R4 where pid='" + pid + "'";
		JdbcUtil.update(sql);
		String wheres="pid='"+pid+"'";
		List<FACompFixedAssetTree> fafalList=this.faCompleteDAO.findByWhere(FACompFixedAssetTree.class.getName(), wheres);
		List<String> parentIdList = new ArrayList<String>();
		if(fafalList!=null&&fafalList.size()>0){
			for(int i=0;i<fafalList.size();i++){
				FACompFixedAssetTree fafal=fafalList.get(i);
				FacompTransferAssetsR4 fapadr=new FacompTransferAssetsR4();
				fapadr.setPid(pid);
				fapadr.setAssetname(fafal.getFixedname());
				fapadr.setAssetno(fafal.getFixedno());
				fapadr.setIsleaf(fafal.getIsleaf());
				fapadr.setParentid(pid+"-"+fafal.getParentid());
				fapadr.setTreeid(pid+"-"+fafal.getTreeid());
				fapadr.setTypetreeid(fafal.getUids());
				fapadr.setRemark(fafal.getRemark());
				if(fapadr.getIsleaf()==1){
					List<FacompTransferAssetsR4View> ffalist=this.faCompleteDAO.findByWhere(FacompTransferAssetsR4View.class.getName(), "treeid='"+fapadr.getTreeid()+"' and pid='"+pid+"'");
					if(ffalist!=null&&ffalist.size()>0){
						FacompTransferAssetsR4View fatar4v=ffalist.get(0);
						Double buildMoney=fatar4v.getBuildMoney()==null?new Double(0):fatar4v.getBuildMoney();
						Double equipBuyMoney=fatar4v.getEquipBuyMoney()==null?new Double(0):fatar4v.getEquipBuyMoney();
						Double installMoney=fatar4v.getInstallMoney()==null?new Double(0):fatar4v.getInstallMoney();
						Double contMoney=fatar4v.getContMoney()==null?new Double(0):fatar4v.getContMoney();
						Double fixedAssetsMoney=fatar4v.getFixedAssetsMoney()==null?new Double(0):fatar4v.getFixedAssetsMoney();
						Double currentAssetsMoney=fatar4v.getCurrentAssetsMoney()==null?new Double(0):fatar4v.getCurrentAssetsMoney();
						Double intangibleAssetsMoney=fatar4v.getIntangibleAssetsMoney()==null?new Double(0):fatar4v.getIntangibleAssetsMoney();
						Double longTermUnamortizedMoney=fatar4v.getLongTermUnamortizedMoney()==null?new Double(0):fatar4v.getLongTermUnamortizedMoney();
						fapadr.setBuildMoney(buildMoney);
						fapadr.setEquipBuyMoney(equipBuyMoney);
						fapadr.setInstallMoney(installMoney);
						fapadr.setContMoney(contMoney);
						fapadr.setFixedAssetsMoney(fixedAssetsMoney);
						fapadr.setCurrentAssetsMoney(currentAssetsMoney);
						fapadr.setIntangibleAssetsMoney(intangibleAssetsMoney);
						fapadr.setLongTermUnamortizedMoney(longTermUnamortizedMoney);
						Double otherCostMoney=contMoney+fixedAssetsMoney+currentAssetsMoney+intangibleAssetsMoney+longTermUnamortizedMoney;
						Double transferTotalMoney=otherCostMoney+buildMoney+equipBuyMoney+installMoney;
						fapadr.setOtherCostMoney(otherCostMoney);
						fapadr.setTransferTotalMoney(transferTotalMoney);
					}
					String parentId = fapadr.getParentid();
					if (!parentIdList.contains(parentId)) {
						parentIdList.add(parentId);
					}
				}
				this.faCompleteDAO.saveOrUpdate(fapadr);
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumMoneyHandlerR4(iterator.next(),pid);
			}
			addSumItemsForReport4(pid);
		}
		return "1";
	}

	@SuppressWarnings("unchecked")
	public void addSumItemsForReport4(String pid){
		List<FacompTransferAssetsR4> repList = faCompleteDAO.findByWhere(
				FacompTransferAssetsR4.class.getName(), "treeid='" + pid + "-01' and pid = '" + pid + "'");
		if (repList!=null&&repList.size() > 0) {
			FacompTransferAssetsR4 fabcr3=(FacompTransferAssetsR4) repList.get(0);
			FacompTransferAssetsR4 fabcr32=new FacompTransferAssetsR4();
			fabcr32.setPid(pid);
			fabcr32.setTreeid(pid+"-019999");
			fabcr32.setAssetname("移交资产总值");
			fabcr32.setIsleaf(1L);
			fabcr32.setParentid(pid+"-01");
			fabcr32.setBuildMoney(fabcr3.getBuildMoney());
			fabcr32.setEquipBuyMoney(fabcr3.getEquipBuyMoney());
			fabcr32.setInstallMoney(fabcr3.getInstallMoney());
			fabcr32.setContMoney(fabcr3.getContMoney());
			fabcr32.setFixedAssetsMoney(fabcr3.getFixedAssetsMoney());
			fabcr32.setCurrentAssetsMoney(fabcr3.getCurrentAssetsMoney());
			fabcr32.setIntangibleAssetsMoney(fabcr3.getIntangibleAssetsMoney());
			fabcr32.setLongTermUnamortizedMoney(fabcr3.getLongTermUnamortizedMoney());
			fabcr32.setOtherCostMoney(fabcr3.getOtherCostMoney());
			fabcr32.setTransferTotalMoney(fabcr3.getTransferTotalMoney());
			this.faCompleteDAO.saveOrUpdate(fabcr32);
		}
	}

	@SuppressWarnings("unchecked")
	public void sumMoneyHandlerR4(String parentId,String pid){
		Double buildMoney=new Double(0);
		Double equipBuyMoney=new Double(0);
		Double installMoney=new Double(0);
		Double contMoney=new Double(0);
		Double fixedAssetsMoney=new Double(0);
		Double currentAssetsMoney=new Double(0);
		Double intangibleAssetsMoney=new Double(0);
		Double longTermUnamortizedMoney=new Double(0);
		Double otherCostMoney=new Double(0);
		Double transferTotalMoney=new Double(0);
		String beanName = FacompTransferAssetsR4.class.getName();
		List<FacompTransferAssetsR4> list = this.faCompleteDAO.findByWhere(beanName, "parentid='"+parentId+"' and pid='"+pid+"'");
		for (Iterator<FacompTransferAssetsR4> iterator = list.iterator(); iterator.hasNext();) {
			FacompTransferAssetsR4 fabcr3 = (FacompTransferAssetsR4) iterator.next();
			buildMoney+=fabcr3.getBuildMoney()==null?new Double(0):fabcr3.getBuildMoney();
			equipBuyMoney+=fabcr3.getEquipBuyMoney()==null?new Double(0):fabcr3.getEquipBuyMoney();
			installMoney+=fabcr3.getInstallMoney()==null?new Double(0):fabcr3.getInstallMoney();
			contMoney+=fabcr3.getContMoney()==null?new Double(0):fabcr3.getContMoney();
			fixedAssetsMoney+=fabcr3.getFixedAssetsMoney()==null?new Double(0):fabcr3.getFixedAssetsMoney();
			currentAssetsMoney+=fabcr3.getCurrentAssetsMoney()==null?new Double(0):fabcr3.getCurrentAssetsMoney();
			intangibleAssetsMoney+=fabcr3.getIntangibleAssetsMoney()==null?new Double(0):fabcr3.getIntangibleAssetsMoney();
			longTermUnamortizedMoney+=fabcr3.getLongTermUnamortizedMoney()==null?new Double(0):fabcr3.getLongTermUnamortizedMoney();
			otherCostMoney+=fabcr3.getOtherCostMoney()==null?new Double(0):fabcr3.getOtherCostMoney();
			transferTotalMoney+=fabcr3.getTransferTotalMoney()==null?new Double(0):fabcr3.getTransferTotalMoney();
		}
		List<FacompTransferAssetsR4> parentInfoList = this.faCompleteDAO.findByWhere(beanName, "treeid='"+parentId+"' and pid='"+pid+"'");
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompTransferAssetsR4 parentInfo=parentInfoList.get(0);
			parentInfo.setBuildMoney(buildMoney);
			parentInfo.setEquipBuyMoney(equipBuyMoney);
			parentInfo.setInstallMoney(installMoney);
			parentInfo.setContMoney(contMoney);
			parentInfo.setFixedAssetsMoney(fixedAssetsMoney);
			parentInfo.setCurrentAssetsMoney(currentAssetsMoney);
			parentInfo.setIntangibleAssetsMoney(intangibleAssetsMoney);
			parentInfo.setLongTermUnamortizedMoney(longTermUnamortizedMoney);
			parentInfo.setOtherCostMoney(otherCostMoney);
			parentInfo.setTransferTotalMoney(transferTotalMoney);
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!((pid+"-0").equals(parentInfo.getParentid()))) {
				sumMoneyHandlerR4(parentInfo.getParentid(),pid);
			}
		}
	}

	/**
	 * 移交资产总表——房屋、建筑物一览表(竣建04-1表)
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />
	 *            如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 * @return String
	 * @author qiupy 2013-7-31
	 */
	@SuppressWarnings("unchecked")
	public String initFacompTransferAssetsR41(Boolean force,String pid){
		if (!force) {
			List<FacompTransferAssetsR41> repList = faCompleteDAO.findByWhere(FacompTransferAssetsR41.class.getName(), "pid='" + pid + "'");
			if (repList.size() > 0) {
				return "1";
			}else{
				return "0";
			}
		}
		String sql = "delete from FACOMP_TRANSFER_ASSETS_R4_1 where pid = '" + pid + "'";
		JdbcUtil.update(sql);
		String wheres="(treeid like '"+FIXED_ASSET_TYPE_TJ_FW+"%' or treeid like '"+FIXED_ASSET_TYPE_TJ_JZWANDGZW+"%' or treeid='"+FIXED_ASSET_TYPE_SCYGDZC+"') and pid='"+pid+"'";
		List<FACompFixedAssetTree> fafalList=this.faCompleteDAO.findByWhere(FACompFixedAssetTree.class.getName(), wheres);
		List<String> parentIdList = new ArrayList<String>();
		if(fafalList!=null&&fafalList.size()>0){
			for(int i=0;i<fafalList.size();i++){
				FACompFixedAssetTree fafal=fafalList.get(i);
				FacompTransferAssetsR41 fapadr=new FacompTransferAssetsR41();
				fapadr.setPid(pid);
				fapadr.setAssetname(fafal.getFixedname());
				fapadr.setAssetno(fafal.getFixedno());
				fapadr.setIsleaf(fafal.getIsleaf());
				fapadr.setParentid(pid+"-"+fafal.getParentid());
				fapadr.setTreeid(pid+"-"+fafal.getTreeid());
				fapadr.setTypetreeid(fafal.getUids());
				if(fafal.getIsleaf()==1){
					List<FacompFixedAsset> ffalist=this.faCompleteDAO.findByWhere(FacompFixedAsset.class.getName(), "typetreeuids='"+fafal.getUids()+"' and pid='"+pid+"'");
					for(int j=0;j<ffalist.size();j++){
						FacompFixedAsset ffa=ffalist.get(j);//每个固定资产下面只有条明细
						FacompTransferAssetsR41 fapadr1=new FacompTransferAssetsR41();
						fapadr1.setPid(pid);
						fapadr1.setAssetname(ffa.getFixedname());
						fapadr1.setAssetno(ffa.getFixedno());
						fapadr1.setIsleaf(1L);
						fapadr1.setParentid(pid+"-"+fafal.getTreeid());
						fapadr1.setTreeid(pid+"-"+fafal.getTreeid()+"-"+ffa.getUids());
						fapadr1.setTypetreeid(ffa.getTypetreeuids());//存放资产分类树主键
						fapadr1.setRemark(ffa.getRemark());
						//需要修改
						fapadr1.setPosition(ffa.getScwz());
						fapadr1.setStructure(ffa.getJgcc());
						fapadr1.setUnit(ffa.getUnit());
						fapadr1.setNum(ffa.getNum());
						Double jzgcGcl=ffa.getJzgcGcl()==null?0d:ffa.getJzgcGcl();
						Double jzgcCl=ffa.getJzgcCl()==null?0d:ffa.getJzgcCl();
						Double costOne=ffa.getQtfyOne()==null?0d:ffa.getQtfyOne();
						Double costTwo=ffa.getQtfyTwo()==null?0d:ffa.getQtfyTwo();
						Double contmoney=costOne+costTwo;
						Double buildmoney=jzgcGcl+jzgcCl;
						Double transfertotalmoney=contmoney+buildmoney;
						fapadr1.setBuildmoney(buildmoney);
						fapadr1.setContmoney(contmoney);
						fapadr1.setTransfertotalmoney(transfertotalmoney);
						this.faCompleteDAO.saveOrUpdate(fapadr1);
					}
					if(ffalist!=null&&ffalist.size()>0) fapadr.setIsleaf(0L);
					String parentId = fapadr.getTreeid();
					if (!parentIdList.contains(parentId)) {
						parentIdList.add(parentId);
					}
				}
				this.faCompleteDAO.saveOrUpdate(fapadr);
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumMoneyHandlerR4_1(iterator.next(),pid);
			}
		}
		return "1";
	}

	@SuppressWarnings("unchecked")
	public void sumMoneyHandlerR4_1(String parentId,String pid){
		Double contmoney=new Double(0);
		Double buildmoney=new Double(0);
		Double transfertotalmoney=new Double(0);
		String beanName=FacompTransferAssetsR41.class.getName();
		List<FacompTransferAssetsR41> list = this.faCompleteDAO.findByWhere(beanName, "parentid='"+parentId+"' and pid='"+pid+"'");
		for (Iterator<FacompTransferAssetsR41> iterator = list.iterator(); iterator.hasNext();) {
			FacompTransferAssetsR41 fabcr3 = (FacompTransferAssetsR41) iterator.next();
			contmoney+=fabcr3.getContmoney()==null?new Double(0):fabcr3.getContmoney();
			buildmoney+=fabcr3.getBuildmoney()==null?new Double(0):fabcr3.getBuildmoney();
			transfertotalmoney+=fabcr3.getTransfertotalmoney()==null?new Double(0):fabcr3.getTransfertotalmoney();
		}
		List<FacompTransferAssetsR41> parentInfoList = this.faCompleteDAO.findByWhere(beanName, "treeid='"+parentId+"' and pid='"+pid+"'");
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompTransferAssetsR41 parentInfo=parentInfoList.get(0);
			parentInfo.setBuildmoney(buildmoney);
			parentInfo.setContmoney(contmoney);
			parentInfo.setTransfertotalmoney(transfertotalmoney);
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!((pid+"-01").equals(parentInfo.getParentid()))) {
				sumMoneyHandlerR4_1(parentInfo.getParentid(),pid);
			}
		}
	}

	/**
	 * 移交资产总表——安装的机械设备一览表(竣建04-2表)
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />
	 *            如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 * @return String
	 * @author qiupy 2013-7-31
	 */
	@SuppressWarnings("unchecked")
	public String initFacompTransferAssetsR42(Boolean force,String pid){
		if (!force) {
			List<FacompTransferAssetsR42> repList = faCompleteDAO.findByWhere(FacompTransferAssetsR42.class.getName(), "pid='" + pid + "'");
			if (repList.size() > 0) {
				return "1";
			}else{
				return "0";
			}
		}
		String sql = "delete from FACOMP_TRANSFER_ASSETS_R4_2 where pid = '" + pid + "'";
		JdbcUtil.update(sql);
		String wheres="(treeid like '"+FIXED_ASSET_TYPE_SB_NEED_SB+"%' or treeid='"+FIXED_ASSET_TYPE_SCYGDZC+"') and pid='"+pid+"'";
		List<FACompFixedAssetTree> fafalList=this.faCompleteDAO.findByWhere(FACompFixedAssetTree.class.getName(), wheres);
		List<String> parentIdList = new ArrayList<String>();
		if(fafalList!=null&&fafalList.size()>0){
			for(int i=0;i<fafalList.size();i++){
				FACompFixedAssetTree fafal=fafalList.get(i);
				FacompTransferAssetsR42 fapadr=new FacompTransferAssetsR42();
				fapadr.setPid(pid);
				fapadr.setAssetname(fafal.getFixedname());
				fapadr.setAssetno(fafal.getFixedno());
				fapadr.setIsleaf(fafal.getIsleaf());
				fapadr.setParentid(pid+"-"+fafal.getParentid());
				fapadr.setTreeid(pid+"-"+fafal.getTreeid());
				fapadr.setTypetreeid(fafal.getUids());
				if(fafal.getIsleaf()==1){
					List<FacompFixedAsset> ffalist=this.faCompleteDAO.findByWhere(FacompFixedAsset.class.getName(), "typetreeuids='"+fafal.getUids()+"' and pid='"+pid+"'");
					for(int j=0;j<ffalist.size();j++){
						FacompFixedAsset ffa=ffalist.get(j);//每个固定资产下面只有条明细
						FacompTransferAssetsR42 fapadr1=new FacompTransferAssetsR42();
						fapadr1.setPid(pid);
						fapadr1.setAssetname(ffa.getFixedname());
						fapadr1.setAssetno(ffa.getFixedno());
						fapadr1.setIsleaf(1L);
						fapadr1.setParentid(pid+"-"+fafal.getTreeid());
						fapadr1.setTreeid(pid+"-"+fafal.getTreeid()+"-"+ffa.getUids());
						fapadr1.setTypetreeid(ffa.getTypetreeuids());//存放资产分类树主键
						fapadr1.setRemark(ffa.getRemark());
						//需要修改
						fapadr1.setPosition(ffa.getScwz());
						fapadr1.setStructure(ffa.getJgcc());
						fapadr1.setDeliveryUnit(ffa.getDeliveryUnit());
						fapadr1.setUnit(ffa.getUnit());
						fapadr1.setNum(ffa.getNum());
						Double jzgcGcl=ffa.getJzgcGcl()==null?0d:ffa.getJzgcGcl();
						Double jzgcCl=ffa.getJzgcCl()==null?0d:ffa.getJzgcCl();
						Double costOne=ffa.getQtfyOne()==null?0d:ffa.getQtfyOne();
						Double costTwo=ffa.getQtfyTwo()==null?0d:ffa.getQtfyTwo();
						Double azgcGcl=ffa.getAzgcGcl()==null?0d:ffa.getAzgcGcl();
						Double azgcCl=ffa.getAzgcCl()==null?0d:ffa.getAzgcCl();
						Double equipBuyMoney=ffa.getSbgzf()==null?0d:ffa.getSbgzf();
						Double otherCostMoney=costOne+costTwo;
						Double equipBedMoney=jzgcGcl+jzgcCl;
						Double installMoney=azgcGcl+azgcCl;
						Double transferTotalMoney=otherCostMoney+equipBedMoney+equipBuyMoney+installMoney;
						fapadr1.setEquipBuyMoney(equipBuyMoney);
						fapadr1.setEquipBedMoney(equipBedMoney);
						fapadr1.setInstallMoney(installMoney);
						fapadr1.setOtherCostMoney(otherCostMoney);
						fapadr1.setTransferTotalMoney(transferTotalMoney);
						this.faCompleteDAO.saveOrUpdate(fapadr1);
					}
					if(ffalist!=null&&ffalist.size()>0) fapadr.setIsleaf(0L);
					String parentId = fapadr.getTreeid();
					if (!parentIdList.contains(parentId)) {
						parentIdList.add(parentId);
					}
				}
				this.faCompleteDAO.saveOrUpdate(fapadr);
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumMoneyHandlerR4_2(iterator.next(),pid);
			}
		}
		return "1";
	}

	@SuppressWarnings("unchecked")
	public void sumMoneyHandlerR4_2(String parentId,String pid){
		Double equipBuyMoney=new Double(0);
		Double otherCostMoney=new Double(0);
		Double equipBedMoney=new Double(0);
		Double installMoney=new Double(0);
		Double transferTotalMoney=new Double(0);
		String beanName=FacompTransferAssetsR42.class.getName();
		List<FacompTransferAssetsR42> list = this.faCompleteDAO.findByWhere(beanName, "parentid='"+parentId+"' and pid='"+pid+"'");
		for (Iterator<FacompTransferAssetsR42> iterator = list.iterator(); iterator.hasNext();) {
			FacompTransferAssetsR42 fabcr3 = (FacompTransferAssetsR42) iterator.next();
			equipBuyMoney+=fabcr3.getEquipBuyMoney()==null?new Double(0):fabcr3.getEquipBuyMoney();
			otherCostMoney+=fabcr3.getOtherCostMoney()==null?new Double(0):fabcr3.getOtherCostMoney();
			equipBedMoney+=fabcr3.getEquipBedMoney()==null?new Double(0):fabcr3.getEquipBedMoney();
			installMoney+=fabcr3.getInstallMoney()==null?new Double(0):fabcr3.getInstallMoney();
			transferTotalMoney+=fabcr3.getTransferTotalMoney()==null?new Double(0):fabcr3.getTransferTotalMoney();
		}
		List<FacompTransferAssetsR42> parentInfoList = this.faCompleteDAO.findByWhere(beanName, "treeid='"+parentId+"' and pid='"+pid+"'");
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompTransferAssetsR42 parentInfo=parentInfoList.get(0);
			parentInfo.setEquipBuyMoney(equipBuyMoney);
			parentInfo.setEquipBedMoney(equipBedMoney);
			parentInfo.setInstallMoney(installMoney);
			parentInfo.setOtherCostMoney(otherCostMoney);
			parentInfo.setTransferTotalMoney(transferTotalMoney);
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!((pid+"-01").equals(parentInfo.getParentid()))) {
				sumMoneyHandlerR4_2(parentInfo.getParentid(),pid);
			}
		}
	}

	/**
	 * 移交资产总表——不需要安装的机械设备、工器具及家具一览表(竣建04-3表)
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />
	 *            如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 * @return String
	 * @throws 目前数据不全 ，后续可能重写，暂时方案
	 * @author qiupy 2013-7-31
	 */
	@SuppressWarnings("unchecked")
	public String initFacompTransferAssetsR43(Boolean force,String pid){
		if (!force) {
			List<FacompTransferAssetsR43> repList = faCompleteDAO.findByWhere(FacompTransferAssetsR43.class.getName(), "pid = '" + pid + "'");
			if (repList.size() > 0) {
				return "1";
			}else{
				return "0";
			}
		}
		String sql = "delete from FACOMP_TRANSFER_ASSETS_R4_3 where pid = '" + pid + "'";
		JdbcUtil.update(sql);
		//只做了固定资产的不需要安装设备和工器具及家具
		String wheres="(treeid like '"+FIXED_ASSET_TYPE_SB_UN_NEED_SB+"%' or treeid like '"+FIXED_ASSET_TYPE_GQJ_AND_JJ+"%' or treeid='"+FIXED_ASSET_TYPE_SCYGDZC+"') and pid='"+pid+"'";
		List<FACompFixedAssetTree> fafalList=this.faCompleteDAO.findByWhere(FACompFixedAssetTree.class.getName(), wheres);
		List<String> parentIdList = new ArrayList<String>();
		if(fafalList!=null&&fafalList.size()>0){
			for(int i=0;i<fafalList.size();i++){
				FACompFixedAssetTree fafal=fafalList.get(i);
				FacompTransferAssetsR43 fapadr=new FacompTransferAssetsR43();
				fapadr.setPid(pid);
				fapadr.setAssetname(fafal.getFixedname());
				fapadr.setAssetno(fafal.getFixedno());
				fapadr.setIsleaf(fafal.getIsleaf());
				fapadr.setParentid(pid+"-"+fafal.getParentid());
				fapadr.setTreeid(pid+"-"+fafal.getTreeid());
				fapadr.setTypetreeid(fafal.getUids());
				if(fafal.getIsleaf()==1){
					List<FacompFixedAsset> ffalist=this.faCompleteDAO.findByWhere(FacompFixedAsset.class.getName(), "typetreeuids='"+fafal.getUids()+"' and pid='"+pid+"'");
					for(int j=0;j<ffalist.size();j++){
						FacompFixedAsset ffa=ffalist.get(j);//每个固定资产下面只有条明细
						FacompTransferAssetsR43 fapadr1=new FacompTransferAssetsR43();
						fapadr1.setPid(pid);
						fapadr1.setAssetname(ffa.getFixedname());
						fapadr1.setAssetno(ffa.getFixedno());
						fapadr1.setIsleaf(1L);
						fapadr1.setParentid(pid+"-"+fafal.getTreeid());
						fapadr1.setTreeid(pid+"-"+fafal.getTreeid()+"-"+ffa.getUids());
						fapadr1.setTypetreeid(ffa.getTypetreeuids());//存放资产分类树主键
						fapadr1.setRemark(ffa.getRemark());
						//需要修改
						fapadr1.setPosition(ffa.getScwz());
						fapadr1.setStructure(ffa.getJgcc());
						fapadr1.setDeliveryUnit(ffa.getDeliveryUnit());
						fapadr1.setUnit(ffa.getUnit());
						fapadr1.setNum(ffa.getNum());
						Double jzgcGcl=ffa.getJzgcGcl()==null?0d:ffa.getJzgcGcl();
						Double jzgcCl=ffa.getJzgcCl()==null?0d:ffa.getJzgcCl();
						Double costOne=ffa.getQtfyOne()==null?0d:ffa.getQtfyOne();
						Double costTwo=ffa.getQtfyTwo()==null?0d:ffa.getQtfyTwo();
						Double azgcGcl=ffa.getAzgcGcl()==null?0d:ffa.getAzgcGcl();
						Double azgcCl=ffa.getAzgcCl()==null?0d:ffa.getAzgcCl();
						Double equipBuyMoney=ffa.getSbgzf()==null?0d:ffa.getSbgzf();
						Double otherCostMoney=costOne+costTwo;
						Double equipBedMoney=jzgcGcl+jzgcCl;
						Double installMoney=azgcGcl+azgcCl;
						Double transferTotalMoney=otherCostMoney+equipBedMoney+equipBuyMoney+installMoney;
						fapadr1.setFixedAssetsMoney(transferTotalMoney);
						fapadr1.setTransferTotalMoney(transferTotalMoney);
						this.faCompleteDAO.saveOrUpdate(fapadr1);
					}
					if(ffalist!=null&&ffalist.size()>0) fapadr.setIsleaf(0L);
					String parentId = fapadr.getTreeid();
					if (!parentIdList.contains(parentId)) {
						parentIdList.add(parentId);
					}
				}
				this.faCompleteDAO.saveOrUpdate(fapadr);
			}
		}
		//流动资产--工器具、家具、备品备件
		String wheres1="(treeid like '"+FIXED_ASSET_TYPE_LDZC+"%') and pid='"+pid+"'";
		List<FACompFixedAssetTree> fafalList1=this.faCompleteDAO.findByWhere(FACompFixedAssetTree.class.getName(), wheres1);
		if(fafalList1!=null&&fafalList1.size()>0){
			for(int i=0;i<fafalList1.size();i++){
				FACompFixedAssetTree fafal=fafalList1.get(i);
				FacompTransferAssetsR43 fapadr=new FacompTransferAssetsR43();
				fapadr.setPid(pid);
				fapadr.setAssetname(fafal.getFixedname());
				fapadr.setAssetno(fafal.getFixedno());
				fapadr.setIsleaf(fafal.getIsleaf());
				fapadr.setParentid(pid+"-"+fafal.getParentid());
				fapadr.setTreeid(pid+"-"+fafal.getTreeid());
				fapadr.setTypetreeid(fafal.getUids());
				if(fafal.getIsleaf()==1){
					List<FacompEquWzBmInv> ffalist=this.faCompleteDAO.findByWhere(FacompEquWzBmInv.class.getName(), "assetsFl='"+fafal.getUids()+"' and pid='"+pid+"'");
					for(int j=0;j<ffalist.size();j++){
						FacompEquWzBmInv ffa=ffalist.get(j);//每个固定资产下面只有条明细
						FacompTransferAssetsR43 fapadr1=new FacompTransferAssetsR43();
						fapadr1.setPid(pid);
						fapadr1.setAssetname(ffa.getAssetsName());
						fapadr1.setAssetno(ffa.getAssetsNo());
						fapadr1.setIsleaf(1L);
						fapadr1.setParentid(pid+"-"+fafal.getTreeid());
						fapadr1.setTreeid(pid+"-"+fafal.getTreeid()+"-"+ffa.getUids());
						fapadr1.setTypetreeid(ffa.getAssetsFl());//存放资产分类树主键
						fapadr1.setRemark(ffa.getRemark());
						fapadr1.setPosition("");
						fapadr1.setStructure(ffa.getGgxh());
						//取合同乙方单位为供货商
						if(ffa.getConid()!=null&&ffa.getConid().length()>0){
							ConOveView cov=(ConOveView) this.faCompleteDAO.findById(ConOveView.class.getName(), ffa.getConid());
							if(cov!=null){
								String partybno=cov.getPartybno();
								if(partybno!=null&&partybno.length()>0){
									ConPartyb partyb=(ConPartyb) this.faCompleteDAO.findById(ConPartyb.class.getName(), partybno);
									if(partyb!=null) fapadr1.setDeliveryUnit(partyb.getPartyb());
								}
							}
						}
						fapadr1.setUnit(ffa.getUnit());
						fapadr1.setNum(ffa.getStockNum());
						fapadr1.setCurrentAssetsMoney(ffa.getKcMoney());
						fapadr1.setTransferTotalMoney(ffa.getKcMoney());
						this.faCompleteDAO.saveOrUpdate(fapadr1);
					}
					if(ffalist!=null&&ffalist.size()>0) fapadr.setIsleaf(0L);
					String parentId = fapadr.getTreeid();
					if (!parentIdList.contains(parentId)) {
						parentIdList.add(parentId);
					}
				}
				this.faCompleteDAO.saveOrUpdate(fapadr);
			}
		}
		for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
			this.sumMoneyHandlerR4_3(iterator.next(),pid);
		}
		return "1";
	}
	@SuppressWarnings("unchecked")
	public void sumMoneyHandlerR4_3(String parentId,String pid){
		Double fixedAssetsMoney=new Double(0);
		Double currentAssetsMoney=new Double(0);
		Double transferTotalMoney=new Double(0);
		String beanName=FacompTransferAssetsR43.class.getName();
		List<FacompTransferAssetsR43> list = this.faCompleteDAO.findByWhere(beanName, "parentid='"+parentId+"' and pid='"+pid+"'");
		for (Iterator<FacompTransferAssetsR43> iterator = list.iterator(); iterator.hasNext();) {
			FacompTransferAssetsR43 fabcr3 = iterator.next();
			fixedAssetsMoney+=fabcr3.getFixedAssetsMoney()==null?new Double(0):fabcr3.getFixedAssetsMoney();
			currentAssetsMoney+=fabcr3.getCurrentAssetsMoney()==null?new Double(0):fabcr3.getCurrentAssetsMoney();
			transferTotalMoney+=fabcr3.getTransferTotalMoney()==null?new Double(0):fabcr3.getTransferTotalMoney();
			transferTotalMoney+=fabcr3.getTransferTotalMoney()==null?new Double(0):fabcr3.getTransferTotalMoney();
		}
		List<FacompTransferAssetsR43> parentInfoList = this.faCompleteDAO.findByWhere(beanName, "treeid='"+parentId+"' and pid='"+pid+"'");
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompTransferAssetsR43 parentInfo=parentInfoList.get(0);
			parentInfo.setFixedAssetsMoney(fixedAssetsMoney);
			parentInfo.setCurrentAssetsMoney(currentAssetsMoney);
			parentInfo.setTransferTotalMoney(transferTotalMoney);
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!((pid+"-01").equals(parentInfo.getParentid()))) {
				sumMoneyHandlerR4_3(parentInfo.getParentid(),pid);
			}
		}
	}

	/**
	 * 移交资产总表——长期待摊费用、无形资产一览表(竣建04-4表)
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />
	 *            如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 * @return String
	 * @author qiupy 2013-7-31
	 */
	@SuppressWarnings("unchecked")
	public String initFacompTransferAssetsR44(Boolean force,String pid){
		if (!force) {
			List<FacompTransferAssetsR44> repList = faCompleteDAO.findByWhere(FacompTransferAssetsR44.class.getName(), "pid = '" + pid + "'");
			if (repList.size() > 0) {
				return "1";
			}else{
				return "0";
			}
		}
		String sql = "delete from FACOMP_TRANSFER_ASSETS_R4_4 where pid = '" + pid + "'";
		JdbcUtil.update(sql);
		//只做了固定资产的不需要安装设备和工器具及家具
		String wheres="(treeid like '"+FIXED_ASSET_TYPE_CQDT+"%' or treeid like '"+FIXED_ASSET_TYPE_WXZC+"%') and pid='"+pid+"'";
		List<FACompFixedAssetTree> fafalList=this.faCompleteDAO.findByWhere(FACompFixedAssetTree.class.getName(), wheres);
		List<String> parentIdList = new ArrayList<String>();
		if(fafalList!=null&&fafalList.size()>0){
			for(int i=0;i<fafalList.size();i++){
				FACompFixedAssetTree fafal=fafalList.get(i);
				FacompTransferAssetsR44 fapadr=new FacompTransferAssetsR44();
				fapadr.setPid(pid);
				fapadr.setAssetname(fafal.getFixedname());
				fapadr.setAssetno(fafal.getFixedno());
				fapadr.setIsleaf(fafal.getIsleaf());
				fapadr.setParentid(pid+"-"+fafal.getParentid());
				fapadr.setTreeid(pid+"-"+fafal.getTreeid());
				fapadr.setTypetreeid(fafal.getUids());
				if(fafal.getIsleaf()==1){
					List<FacompWxzcCqdtAsset> ffalist=this.faCompleteDAO.findByWhere(FacompWxzcCqdtAsset.class.getName(), "typetreeid='"+fafal.getUids()+"' and pid='"+pid+"'");
					for(int j=0;j<ffalist.size();j++){
						FacompWxzcCqdtAsset ffa=ffalist.get(j);
						FacompTransferAssetsR44 fapadr1=new FacompTransferAssetsR44();
						fapadr1.setPid(pid);
						fapadr1.setAssetname(ffa.getFixedname());
						fapadr1.setAssetno(ffa.getFixedno());
						fapadr1.setIsleaf(1L);
						fapadr1.setParentid(pid+"-"+fafal.getTreeid());
						fapadr1.setTreeid(pid+"-"+fafal.getTreeid()+"-"+ffa.getUids());
						fapadr1.setTypetreeid(ffa.getTypetreeid());
						fapadr1.setRemark(ffa.getRemark());
						//需要修改
						fapadr1.setPosition(ffa.getDeliveryUnit());
						fapadr1.setUnit(ffa.getUnit());
						fapadr1.setNum(ffa.getNum());
						Double assetsMoney=ffa.getMoney()==null?0d:ffa.getMoney();
						if(fafal.getTreeid().indexOf(FIXED_ASSET_TYPE_CQDT)==0){
							fapadr1.setLongTermUnamortizedMoney(assetsMoney);
						}else if(fafal.getTreeid().indexOf(FIXED_ASSET_TYPE_WXZC)==0){
							fapadr1.setIntangibleAssetsMoney(assetsMoney);
						}
						fapadr1.setTransferTotalMoney(assetsMoney);
						this.faCompleteDAO.saveOrUpdate(fapadr1);
					}
					if(ffalist!=null&&ffalist.size()>0) fapadr.setIsleaf(0L);
					String parentId = fapadr.getTreeid();
					if (!parentIdList.contains(parentId)) {
						parentIdList.add(parentId);
					}
				}
				this.faCompleteDAO.saveOrUpdate(fapadr);
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumMoneyHandlerR4_4(iterator.next(),pid);
			}
		}
		return "1";
	}
	@SuppressWarnings("unchecked")
	public void sumMoneyHandlerR4_4(String parentId,String pid){
		Double longTermUnamortizedMoney=new Double(0);
		Double intangibleAssetsMoney=new Double(0);
		Double transferTotalMoney=new Double(0);
		String beanName=FacompTransferAssetsR44.class.getName();
		List<FacompTransferAssetsR44> list = this.faCompleteDAO.findByWhere(beanName, "parentid='"+parentId+"' and pid='"+pid+"'");
		for (Iterator<FacompTransferAssetsR44> iterator = list.iterator(); iterator.hasNext();) {
			FacompTransferAssetsR44 fabcr3 = (FacompTransferAssetsR44) iterator.next();
			longTermUnamortizedMoney+=fabcr3.getLongTermUnamortizedMoney()==null?new Double(0):fabcr3.getLongTermUnamortizedMoney();
			intangibleAssetsMoney+=fabcr3.getIntangibleAssetsMoney()==null?new Double(0):fabcr3.getIntangibleAssetsMoney();
			transferTotalMoney+=fabcr3.getTransferTotalMoney()==null?new Double(0):fabcr3.getTransferTotalMoney();
		}
		List<FacompTransferAssetsR44> parentInfoList = this.faCompleteDAO.findByWhere(beanName, "treeid='"+parentId+"' and pid='"+pid+"'");
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompTransferAssetsR44 parentInfo=parentInfoList.get(0);
			parentInfo.setLongTermUnamortizedMoney(longTermUnamortizedMoney);
			parentInfo.setIntangibleAssetsMoney(intangibleAssetsMoney);
			parentInfo.setTransferTotalMoney(transferTotalMoney);
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!((pid+"-01").equals(parentInfo.getParentid()))) {
				sumMoneyHandlerR4_4(parentInfo.getParentid(),pid);
			}
		}
	}

	/**
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />
	 *            如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 * @return String
	 * @author qiupy 2013-8-6
	 */
	@SuppressWarnings("unchecked")
	public String initFacompDtfyContDetail3(Boolean force,String pid){
		if (!force) {
			List<FacompDtfyContDetail3> repList = faCompleteDAO.findByWhere(FacompDtfyContDetail3.class.getName(), "pid = '" + pid + "'");
			if (repList.size() > 0) {
				return "1";
			}else{
				return "0";
			}
		}
		String sql = "delete from FACOMP_DTFY_CONT_DETAIL_3 where pid = '" + pid + "'";
		JdbcUtil.update(sql);
		String whereSql = "select t.bdgid from bdg_info t where t.pid='" + pid +
				"' connect by prior  t.bdgid= t.parent start with t.bdgid='" + pid + "-0104' order by t.bdgid"; // 找到子节点
		List<Map<String, String>> list = JdbcUtil.query(whereSql);
		//取待摊支出下的财务科目
		String fsSql="select TREEID from FACOMP_FINANCE_SUBJECT where parentid=" +
				"(select treeid from FACOMP_FINANCE_SUBJECT where SUBJECT_BM='16040104' and pid='"+pid+"') and pid='"+pid+"' order by TREEID";
		List<Map<String, String>> fsList = JdbcUtil.query(fsSql);
		for (int i = 0; i < list.size(); i++) {
			Map<String, String> m = list.get(i);
			Object o = m.get("bdgid");
			String uidsTemp = o.toString();
			BdgInfo bdgInfo = (BdgInfo) this.faCompleteDAO.findById(BdgInfo.class.getName(), uidsTemp);
			for(int j=0;j<fsList.size();j++){
				Map<String, String> m1 = fsList.get(j);
				Object o1 = m1.get("TREEID");
				String fsTreeid = o1.toString();
				FacompDtfyContDetail3 faocs=new FacompDtfyContDetail3();
				faocs.setBdgid(bdgInfo.getBdgid());
				faocs.setFinancialAccount(fsTreeid);
				faocs.setPid(pid);
				Double amount=0d;
				if(bdgInfo.getIsleaf()==1){
					String sql1="select nvl(Ratiftmoneytotal,0) amount from FACOMP_DTFY_CONT_3F_VIEW" +
							" where Financial_Account='"+fsTreeid+"' and bdgid='"+bdgInfo.getBdgid()+"' and pid='"+pid+"'";
					List<Map<String, BigDecimal>> l = JdbcUtil.query(sql1);
					Iterator<Map<String, BigDecimal>> it = l.iterator();
					while (it.hasNext()) {
						Map<String, BigDecimal> map = it.next();
						amount=map.get("amount").doubleValue();
					}
				}
				faocs.setAmount(amount);
				this.faCompleteDAO.insert(faocs);
			}
		}
		return "1";
	}

	/**
	 * 获取待摊基建支出分摊明细表(竣建03附表)的xgridTree的xml数据
	 * @param pid
	 * @return String
	 * @author qiupy 2013-8-6
	 */
	@SuppressWarnings("unchecked")
	public String getFacompDtfyContDetail3FXml(String pid){
		int yyyy,mm;
		Calendar cal=Calendar.getInstance();    
		yyyy=cal.get(Calendar.YEAR);    
		mm=cal.get(Calendar.MONTH);  
		String unitname = "";
		String sqlUnit = "select unitname from sgcc_ini_unit where unitid='"+pid+"'";
		List<ListOrderedMap> listUnit = JdbcUtil.query(sqlUnit);
		if(listUnit.size()>0) {
			ListOrderedMap mapUnit = listUnit.get(0) ;
			unitname = mapUnit.getValue(0)==null?"":mapUnit.getValue(0).toString().toUpperCase() ;
		}
		StringBuilder xmlString =new StringBuilder();
		xmlString.append("<?xml version='1.0' encoding='UTF-8'?>");
		xmlString.append("<rows>");
		xmlString.append("<head>");
		xmlString.append("<column width='105' id='BDGNO' type='ro' sort='str' align='left'>待摊基建支出分摊明细表(竣建03附表)</column>");
		xmlString.append("<column width='180' id='BDGNAME' type='tree' sort='str' align='left'>#cspan</column>");
		String fsSql="select SUBJECT_NAME from FACOMP_FINANCE_SUBJECT where parentid=(select treeid from" +
				" FACOMP_FINANCE_SUBJECT where SUBJECT_BM='16040104' and pid='"+pid+"') and pid='"+pid+"' order by TREEID";
		List<Map<String, String>> fsList = JdbcUtil.query(fsSql);
		StringBuilder attachHeader1=new StringBuilder();
		StringBuilder attachHeader2=new StringBuilder();
		StringBuilder attachHeader3=new StringBuilder();
		attachHeader1.append("编制单位：,");
		attachHeader1.append(unitname+",");
		attachHeader2.append("栏目行次,工程项目,");
		attachHeader3.append("<![CDATA[#text_filter,#text_filter,");
		int centerIndex=fsList.size()%2==0?fsList.size()/2:(fsList.size()-1)/2;
		for(int i=0;i<fsList.size();i++){
			Map<String, String> m = fsList.get(i);
			String fsSubjectName = m.get("SUBJECT_NAME");
			xmlString.append("<column width='150' id='value"+i+"' type='ed[=sum]' sort='str' align='left'>#cspan</column>");
			if((centerIndex-1)==i){
				attachHeader1.append("编制日期：,");
			}else if(centerIndex==i){
				attachHeader1.append(yyyy+"年"+(mm+101+"").substring(1)+"月,");
			}else if(i==fsList.size()-1){
				attachHeader1.append("金额单位：元");
			}else{
				attachHeader1.append("　,");
			}
			if(i==fsList.size()-1){
				attachHeader2.append(fsSubjectName);
				attachHeader3.append("#numeric_filter]]>");
			}else{
				attachHeader2.append(fsSubjectName+",");
				attachHeader3.append("#numeric_filter,");
			}
		}
		xmlString.append("<afterInit>");
		xmlString.append("<call command='attachHeader'><param>");
		xmlString.append(attachHeader1.toString());
		xmlString.append("</param></call>");
		xmlString.append("<call command='attachHeader'><param>");
		xmlString.append(attachHeader2.toString());
		xmlString.append("</param></call>");
		xmlString.append("<call command='attachHeader'><param>");
		xmlString.append(attachHeader3.toString());
		xmlString.append("</param></call>");
		xmlString.append("</afterInit>");
		xmlString.append("</head>");
		xmlString.append(this.getChildXmlStr(pid+"-0104",pid));
		xmlString.append("</rows>");
		return xmlString.toString();
	}

	/**
	 * 获取竣建03附表数据
	 * @param bdgid
	 * @param pid
	 * @return String
	 * @author qiupy 2013-8-7
	 */
	@SuppressWarnings("unchecked")
	public String getChildXmlStr(String bdgid,String pid){
		StringBuilder returnStr = new StringBuilder();
		BdgInfo bdgInfo=(BdgInfo) this.faCompleteDAO.findById(BdgInfo.class.getName(), bdgid);
		List<BdgInfo> bdgList=this.faCompleteDAO.findByWhere(BdgInfo.class.getName(), "parent='"+bdgid+"' and pid='"+pid+"'","bdgno");
		returnStr.append("<row id='" + bdgid + "`" + (bdgList.size()==0) + "`" + bdgInfo.getParent() + "' open='1'>");
		returnStr.append("<cell>" + bdgInfo.getBdgno() + "</cell>");
		returnStr.append("<cell>" + bdgInfo.getBdgname() + "</cell>");
		for (int i = 0; i < bdgList.size(); i++) {
			BdgInfo bdgItem=bdgList.get(i);
			returnStr.append(getChildXmlStr(bdgItem.getBdgid(), pid));
		}
		List<FacompDtfyContDetail3> list=this.faCompleteDAO.findByWhere(FacompDtfyContDetail3.class.getName(), "bdgid='"+bdgid+"' and pid='"+pid+"'","financialAccount");
		for(int j=0;j<list.size();j++){
			FacompDtfyContDetail3 fdcd=list.get(j);
			if(fdcd!=null){
				if(bdgList.size()==0){
					if(fdcd.getAmount()==0.0){
						returnStr.append("<cell>0</cell>");
					}else{
						returnStr.append("<cell>"+fdcd.getAmount()+"</cell>");
					}
				} else {
					returnStr.append("<cell></cell>");
				}
			}else{
				returnStr.append("<cell></cell>");
			}
		}
		returnStr.append("</row>");
		return returnStr.toString();
	}

	/**
	 * 其他费用明细表(竣建03表)
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />
	 *            如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 * @return String
	 * @author qiupy 2013-8-7
	 */
	@SuppressWarnings("unchecked")
	public String initFacompOtherCostReport3(Boolean force,String pid){
		if (!force) {
			List<FacompOtherCostReport3> repList = faCompleteDAO.findByWhere(FacompOtherCostReport3.class.getName(), "pid='" + pid + "'");
			if (repList.size() > 0) {
				return "1";
			}else{
				return "0";
			}
		}
		String sql = "delete from FACOMP_OTHER_COST_REPORT_3 where pid = '" + pid + "'";
		JdbcUtil.update(sql);
		//取待摊支出下的财务科目
		String fsSql="select TREEID,PARENTID,ISLEAF,SUBJECT_NAME,SUBJECT_BM,REMARK from FACOMP_FINANCE_SUBJECT where TREEID like " +
				"(select treeid from FACOMP_FINANCE_SUBJECT where SUBJECT_BM='16040104' and pid='"+pid+"')||'%' and pid='"+pid+"' order by TREEID";
		List<Map<String, Object>> fsList = JdbcUtil.query(fsSql);
		List<String> parentIdList = new ArrayList<String>();
		if(fsList!=null&&fsList.size()>0){
			for(int i=0;i<fsList.size();i++){
				Map<String, Object> m = fsList.get(i);
				String treeid=m.get("TREEID")==null?"":m.get("TREEID").toString();
				String parentid=m.get("PARENTID")==null?"":m.get("PARENTID").toString();
				String isleaf=m.get("ISLEAF")==null?"":m.get("ISLEAF").toString();
				String subject_name=m.get("SUBJECT_NAME")==null?"":m.get("SUBJECT_NAME").toString();
				String subject_bm=m.get("SUBJECT_BM")==null?"":m.get("SUBJECT_BM").toString();
				String remark=m.get("REMARK")==null?"":m.get("REMARK").toString();
				FacompOtherCostReport3 focr3=new FacompOtherCostReport3();
				focr3.setPid(pid);
				focr3.setTreeid(pid+"-"+treeid);
				if(i==0){
					focr3.setParentid(pid+"-0");
				}else{
					focr3.setParentid(pid+"-"+parentid); 
				}
				focr3.setIsleaf(Long.parseLong(isleaf));
				focr3.setSubjectBm(subject_bm);
				focr3.setSubjectName(subject_name);
				focr3.setRemark(remark);
				if(focr3.getIsleaf()==1){
					//施工合同、服务合同和其他合同中填写了其他费用类型的合同才计入其他费用
					String moneyApp = "select nvl(sum(nvl(TJMOENY,0)+nvl(SBMONEY,0)),0) dtzc,nvl(sum(LDMONEY),0) LDMONEY," +
							"nvl(sum(WXMONEY),0) WXMONEY,nvl(sum(CQDTMONEY),0) CQDTMONEY from FACOMP_OTHER_COST_STATISTICS where" +
							" treeid in(select b.bdgid||'_'||b.conid  from bdg_project b,con_ove v where b.pid='"+ pid+ "'" +
							" and b.FINANCIAL_ACCOUNT='"+ treeid+"' and b.conid=v.conid and v.CONDIVNO in('SG','QT','FW') and " +
							"v.OTHER_COST_TYPE in('0001','0002','0003','0004','0005')) and pid='"+pid+"'";
					List<Map<String, BigDecimal>> l = JdbcUtil.query(moneyApp);
					Iterator<Map<String, BigDecimal>> it = l.iterator();
					Double bdgMoney=new Double(0d);
					Double deferredExpensesMoney=new Double(0d);
					Double fixedAssetsMoney=new Double(0d);
					Double currentAssetsMoney=new Double(0d);
					Double intangibleAssetsMoney=new Double(0d);
					Double longTermUnamortizedMoney=new Double(0d);
					Double realTotalMoney=new Double(0d);
					while (it.hasNext()) {
						Map<String, BigDecimal> map = (Map<String, BigDecimal>) it.next();
						deferredExpensesMoney=map.get("dtzc").doubleValue();
						currentAssetsMoney=map.get("LDMONEY").doubleValue();
						intangibleAssetsMoney=map.get("WXMONEY").doubleValue();
						longTermUnamortizedMoney=map.get("CQDTMONEY").doubleValue();
					}
					realTotalMoney=deferredExpensesMoney+fixedAssetsMoney+currentAssetsMoney+intangibleAssetsMoney+longTermUnamortizedMoney;
					focr3.setBdgMoney(bdgMoney);
					focr3.setDeferredExpensesMoney(deferredExpensesMoney);
					focr3.setFixedAssetsMoney(fixedAssetsMoney);
					focr3.setCurrentAssetsMoney(currentAssetsMoney);
					focr3.setIntangibleAssetsMoney(intangibleAssetsMoney);
					focr3.setLongTermUnamortizedMoney(longTermUnamortizedMoney);
					focr3.setRealTotalMoney(realTotalMoney);
					String parent=focr3.getParentid();
					if (!parentIdList.contains(parent)) {
						parentIdList.add(parent);
					}
				}
				this.faCompleteDAO.insert(focr3);
			}
			for (Iterator<String> iterator = parentIdList.iterator(); iterator.hasNext();) {
				this.sumMoneyHandlerR3(iterator.next(),pid);
			}
		}
		return "1";
	}

	@SuppressWarnings("unchecked")
	public void sumMoneyHandlerR3(String parentId,String pid){
		Double bdgMoney=new Double(0d);
		Double deferredExpensesMoney=new Double(0d);
		Double fixedAssetsMoney=new Double(0d);
		Double currentAssetsMoney=new Double(0d);
		Double intangibleAssetsMoney=new Double(0d);
		Double longTermUnamortizedMoney=new Double(0d);
		Double realTotalMoney=new Double(0d);
		String beanName=FacompOtherCostReport3.class.getName();
		List<FacompOtherCostReport3> list = this.faCompleteDAO.findByWhere(beanName, "parentid='"+parentId+"' and pid='"+pid+"'");
		for (Iterator<FacompOtherCostReport3> iterator = list.iterator(); iterator.hasNext();) {
			FacompOtherCostReport3 fabcr3 = (FacompOtherCostReport3) iterator.next();
			longTermUnamortizedMoney+=fabcr3.getLongTermUnamortizedMoney()==null?new Double(0):fabcr3.getLongTermUnamortizedMoney();
			intangibleAssetsMoney+=fabcr3.getIntangibleAssetsMoney()==null?new Double(0):fabcr3.getIntangibleAssetsMoney();
			bdgMoney+=fabcr3.getBdgMoney()==null?new Double(0):fabcr3.getBdgMoney();
			deferredExpensesMoney+=fabcr3.getDeferredExpensesMoney()==null?new Double(0):fabcr3.getDeferredExpensesMoney();
			fixedAssetsMoney+=fabcr3.getFixedAssetsMoney()==null?new Double(0):fabcr3.getFixedAssetsMoney();
			currentAssetsMoney+=fabcr3.getCurrentAssetsMoney()==null?new Double(0):fabcr3.getCurrentAssetsMoney();
			realTotalMoney+=fabcr3.getRealTotalMoney()==null?new Double(0):fabcr3.getRealTotalMoney();
		}
		List<FacompOtherCostReport3> parentInfoList = this.faCompleteDAO.findByWhere(beanName, "treeid='"+parentId+"' and pid='"+pid+"'");
		if(parentInfoList != null&&parentInfoList.size()>0){
			FacompOtherCostReport3 parentInfo=parentInfoList.get(0);
			parentInfo.setBdgMoney(bdgMoney);
			parentInfo.setDeferredExpensesMoney(deferredExpensesMoney);
			parentInfo.setFixedAssetsMoney(fixedAssetsMoney);
			parentInfo.setCurrentAssetsMoney(currentAssetsMoney);
			parentInfo.setIntangibleAssetsMoney(intangibleAssetsMoney);
			parentInfo.setLongTermUnamortizedMoney(longTermUnamortizedMoney);
			parentInfo.setRealTotalMoney(realTotalMoney);
			this.faCompleteDAO.saveOrUpdate(parentInfo);
			if (!((pid+"-0").equals(parentInfo.getParentid()))) {
				sumMoneyHandlerR3(parentInfo.getParentid(),pid);
			}
		}
	}

}