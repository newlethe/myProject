package com.sgepit.pmis.budget.service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.fileupload.FileItem;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.hbm.BdgChangeProject;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BdgProject;
import com.sgepit.pmis.budget.hbm.ConProjectBean;
import com.sgepit.pmis.budget.hbm.VBdgConApp;
import com.sgepit.pmis.budget.hbm.VBdgProject;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.hbm.ConCha;

public class BdgProjectMgmImpl extends BaseMgmImpl implements
		BdgProjectMgmFacade {

	BaseDAO baseDao;

	public static BdgProjectMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (BdgProjectMgmImpl) ctx.getBean("bdgProjectMgm");
	}

	public void setBaseDao(BaseDAO baseDao) {
		this.baseDao = baseDao;
	}

	public void deleteBdgProject(BdgProject bdgProject) throws SQLException,
			BusinessException {
		this.baseDao.delete(bdgProject);

	}

	@SuppressWarnings("all")
	public void insertBdgProject(BdgProject bdgProject) throws SQLException,
			BusinessException {
		this.baseDao.insert(bdgProject);
		PcDynamicData  pdd = new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(BdgProject.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgProject.class.getName()));
		if(bdgProject.getProappid()==null||"".equals(bdgProject.getProappid())){
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		}else {
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
		}
		pdd.setPctableuids(bdgProject.getProappid());
		pdd.setPcurl(DynamicDataUtil.BDG_PROJECTAPP_URL);
		pdd.setPid(bdgProject.getPid());
		baseDao.insert(pdd);
		List conList = new ArrayList();
		conList.add(bdgProject);
		conList.add(pdd);
		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
					.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(
					conList, Constant.DefaultOrgRootID,bdgProject.getPid(),"","", "新增工程量");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
	}

	@SuppressWarnings("unchecked")
	public void updateBdgProject(BdgProject bdgProject) throws SQLException,
			BusinessException {
		this.baseDao.saveOrUpdate(bdgProject);
		PcDynamicData  pdd = new PcDynamicData();
		pdd.setPcdynamicdate(new Date());
		pdd.setPctablebean(BdgProject.class.getName());
		pdd.setPctablename(DynamicDataUtil.getTableNameByEntry(BdgProject.class.getName()));
		if(bdgProject.getProappid()==null||"".equals(bdgProject.getProappid())){
			pdd.setPctableoptype(DynamicDataUtil.OP_ADD);
		}else {
			pdd.setPctableoptype(DynamicDataUtil.OP_UPDATE);
		}
		pdd.setPctableuids(bdgProject.getProappid());
		pdd.setPcurl(DynamicDataUtil.BDG_PROJECTAPP_URL);
		pdd.setPid(bdgProject.getPid());
		baseDao.insert(pdd);
		List conList = new ArrayList();
		conList.add(bdgProject);
		conList.add(pdd);
		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
					.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(
					conList, Constant.DefaultOrgRootID,bdgProject.getPid(),"","", "修改工程量");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
	}

	// 关联工程量到合同概算，
	@SuppressWarnings("all")
	public String relaBdgProject(String proid, String appid) {
		String flag = "0";
		String beanName = BusinessConstants.BDG_PACKAGE
				.concat(BusinessConstants.BDG_PROJECT);
		String bdgAppBean = BusinessConstants.BDG_PACKAGE
				.concat(BusinessConstants.BDG_MONEY_APP);
		BdgMoneyApp bdgMoneyApp = (BdgMoneyApp) this.baseDao.findById(
				bdgAppBean, appid);
		BdgProject bdgProject = (BdgProject) this.baseDao.findById(beanName,
				proid);
		bdgProject.setConid(bdgMoneyApp.getConid());
		bdgProject.setBdgid(bdgMoneyApp.getBdgid());
		bdgProject.setMoney(bdgProject.getAmount() * bdgProject.getPrice());
		this.baseDao.saveOrUpdate(bdgProject);
		List dataList = new ArrayList();
		dataList.add(bdgProject);
		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			if (!dataList.isEmpty()) {
				PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
						.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(
						dataList, Constant.DefaultOrgRootID,bdgProject.getPid(),"","", "关联工程量");
				dataExchangeService.addExchangeListToQueue(ExchangeList);
			}
		}
		flag = "1";
		return flag;
	}

	// 删除工程量和合同概算的关联
	@SuppressWarnings("unchecked")
	public String deleteRelaProject(String proid) {
		String flag = "0";
		String beanName = BusinessConstants.BDG_PACKAGE
				.concat(BusinessConstants.BDG_PROJECT);
		BdgProject bdgProject = (BdgProject) this.baseDao.findById(beanName,
				proid);
		bdgProject.setConid(null);
		bdgProject.setBdgid(null);
		this.baseDao.saveOrUpdate(bdgProject);
		List dataList = new ArrayList();
		dataList.add(bdgProject);
		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			if (!dataList.isEmpty()) {
				PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
						.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(
						dataList, Constant.DefaultOrgRootID,bdgProject.getPid(),"","", "删除工程量");
				dataExchangeService.addExchangeListToQueue(ExchangeList);
			}
		}
		flag = "1";
		return flag;
	}

	// 更新合同分摊的实际金额，
	public String refreshApp(String appid) {
		String flag = "0";
		String beanName = BusinessConstants.BDG_PACKAGE
				.concat(BusinessConstants.BDG_PROJECT);
		String bdgAppBean = BusinessConstants.BDG_PACKAGE
				.concat(BusinessConstants.BDG_MONEY_APP);
		BdgMoneyApp bdgMoneyApp = (BdgMoneyApp) this.baseDao.findById(
				bdgAppBean, appid);
		List list = this.baseDao.findByWhere(beanName, "conid = '"
				+ bdgMoneyApp.getConid() + "' and bdgid = '"
				+ bdgMoneyApp.getBdgid() + "'");
		Double sumMoney = new Double(0);
		Iterator itr = list.iterator();
		while (itr.hasNext()) {
			BdgProject projects = (BdgProject) itr.next();
			sumMoney += projects.getMoney();
		}
		bdgMoneyApp.setRealmoney(sumMoney);

		BdgMoneyMgmFacade bdgMoneyMgm = (BdgMoneyMgmFacade) Constant.wact
				.getBean("bdgMoneyMgm");
		bdgMoneyMgm.addOrUpdateBdgMoneyApp(bdgMoneyApp);
		flag = "1";
		return flag;
	}

	// 获取合同变更是，概算节点对应的分摊工程量的总值
	public Double getProjectTotalByBgdId(String conid, String bgdId) {
		Double totalpro = new Double(0);
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = " select nvl(sum(money),0) " + " from bdg_project t "
				+ " where t.conid='" + conid + "' and t.bdgid='" + bgdId + "'";

		totalpro = (Double) jdbc.queryForObject(sql, Double.class);
		return totalpro;
	}

	public boolean checkBdgProValid(String prono, String proname, String conid,
			String pid) {
		String sql = "select count(*) from v_bdg_project t  where   t.pid='"
				+ pid + "' and ( t.prono='" + prono + "' or  t.proname='"
				+ proname + "')";
		List list = baseDao.getDataAutoCloseSes(sql);
		if (list.size() > 0) {
			if (((BigDecimal) list.get(0)).intValue() > 0) {
				return true;
			}
		}
		return false;
	}

	public void deleteBdgChangeProject(BdgChangeProject bdgChangeProject) {
		baseDao.delete(bdgChangeProject);
	}

	public void insertBdgChangeProject(BdgChangeProject bdgChangeProject) {
		baseDao.insert(bdgChangeProject);
	}

	public void updateBdgChangeProject(BdgChangeProject bdgChangeProject) {
		baseDao.saveOrUpdate(bdgChangeProject);
	}

	@SuppressWarnings("unchecked")
	public String checkBdgChangeProjectOnly(String prono, String changestate,
			String changeid, String conid, String pid) {
		String validSql = "select count(*) from bdg_change_project where changeprono='"
				+ prono
				+ "' and state='"
				+ changestate
				+ "' and pid='"
				+ pid
				+ "'";
		List validList = baseDao.getDataAutoCloseSes(validSql);
		if (validList.size() > 0) {
			if (((BigDecimal) validList.get(0)).intValue() > 0) {
				return "1";
			}
		}
		return "";
	}

	@SuppressWarnings("unchecked")
	public String checkBdgProjectSameToChangeProject(String prono,
			String proname, String conid, String pid) {
		String validSql = "select count(*) from v_bdg_project pro where (pro.prono='"
				+ prono
				+ "' or proname='"
				+ proname
				+ "') and pid='"
				+ pid
				+ "'";
		List validList = baseDao.getDataAutoCloseSes(validSql);
		if (validList.size() > 0) {
			if (((BigDecimal) validList.get(0)).intValue() > 0) {
				return "1";
			}
		}
		return "";
	}

	@SuppressWarnings("unchecked")
	public String checkChangeProjectMoneyValid(String conid, String chaid,
			String pid, String appids, String totalMoney) {
		ConCha conCha = (ConCha) baseDao
				.findById(ConCha.class.getName(), chaid);
		String sumSql = "select nvl(sum(nvl(pro.changemoney, 0)), 0) from bdg_change_project pro where pro.changeid = '"
				+ chaid
				+ "'   and conid = '"
				+ conid
				+ "'  and pid = '"
				+ pid
				+ "'";
		List list = baseDao.getDataAutoCloseSes(sumSql);
		double money = 0d;
		if (list.size() > 0) {
			money += ((BigDecimal) list.get(0)).doubleValue();
		}
		if (totalMoney != null && !"".equals(totalMoney)) {
			money += Double.valueOf(totalMoney);
		}
		if (conCha != null) {
			if (money > conCha.getChamoney()) {
				return "1";
			}
		}
		return "";
	}

	@SuppressWarnings("unchecked")
	public void deleteRelateChangeProject(String appid) {
		BdgChangeProject bdgChangeProject = (BdgChangeProject) this.baseDao
				.findById(BdgChangeProject.class.getName(), appid);
		this.baseDao.delete(bdgChangeProject);
		List dataList = new ArrayList();
		dataList.add(bdgChangeProject);
		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			if (!dataList.isEmpty()) {
				PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
						.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(
						dataList, Constant.DefaultOrgRootID,bdgChangeProject.getPid(),"","", "删除工程量");
				dataExchangeService.addExchangeListToQueue(ExchangeList);
			}
		}
	}

	@SuppressWarnings("all")
	public ConProjectBean summaryConProjectBdgInfo(String conid,
			String projectId, String bdgid, String pid) {
		ConProjectBean conProjectBean = new ConProjectBean();
		conProjectBean.setConProjectAppmoney(getConProjectAppMoney(conid,projectId,pid));
		conProjectBean.setProjectConAppTotalmoney(getProjectConAppTotalmoney(conid,pid));
		conProjectBean.setConSigedProjectMoney(getConSigedProjectMoney(conid,pid));
		conProjectBean.setConChangeProjectMoney(getConChangeProjectMoney(conid, pid));
		conProjectBean.setBdgProjectAppMoney(getBdgProjectAppMoney(bdgid,pid));
		conProjectBean.setConProjectAppNum(getBdgProjectNum(conid,projectId,pid));
		conProjectBean.setConPrjectAvgmoney(getConProjectAppNum(conid,projectId,pid));
		conProjectBean.setBdgProjectAppNum(bdgProjectTotalMum(bdgid,pid));
		conProjectBean.setBdgProjectAvgMoney(bdgAvgProjectPrice(bdgid,pid));
		return conProjectBean;
	}

	// 获取具体合同下得具体工程量的分摊总金额
	@SuppressWarnings("unchecked")
	public double getConProjectAppMoney(String conid, String projectId,
			String pid) {
		double money = 0d;
		double totalAmount = 0d;
		List list = baseDao.findByWhere(VBdgProject.class.getName(), "conid='"
				+ conid + "' and prono='" + projectId + "' and pid='" + pid
				+ "'");
		if (list.size() > 0) {
			VBdgProject vBdgProject = (VBdgProject) list.get(0);
			totalAmount += vBdgProject.getAmount();

			String bdgChangeProjectAmount = "select nvl(sum(nvl(cpro.changeamount,0)),0) from bdg_change_project  cpro where cpro.conid='"
					+ conid
					+ "' and cpro.changeprono='"
					+ projectId
					+ "' and cpro.pid='" + pid + "' and cpro.state='3'";
			List bdgChangeProjectAmountList = baseDao
					.getDataAutoCloseSes(bdgChangeProjectAmount);
			if (bdgChangeProjectAmountList.size() > 0) {
				totalAmount += ((BigDecimal) bdgChangeProjectAmountList.get(0))
						.doubleValue();
			}
			List priceChangeList = baseDao.findByWhere(BdgChangeProject.class
					.getName(), "conid='" + conid + "' and changeprono='"
					+ vBdgProject.getProno() + "' and pid='" + pid
					+ "' and state='2'");
			if (priceChangeList.size() > 0) {
				BdgChangeProject bdgChangeProject = (BdgChangeProject) priceChangeList
						.get(0);
				money += (totalAmount - bdgChangeProject.getChangeamount())
						* vBdgProject.getPrice();
				money += bdgChangeProject.getChangemoney();
			} else {
				money += (totalAmount) * vBdgProject.getPrice();
			}
		}
		return money;
	}

	// 计算一个合同下得所有工程量分摊总金额
	@SuppressWarnings("all")
	public double getProjectConAppTotalmoney(String conid, String pid) {
		double Totalmoney = 0d;
		List list = baseDao.findByWhere(VBdgProject.class.getName(), "conid='"
				+ conid + "' and pid='" + pid + "'");
		for (int i = 0; i < list.size(); i++) {
			VBdgProject vBdgProject = (VBdgProject) list.get(i);
			Totalmoney += getConProjectAppMoney(vBdgProject.getConid(),
					vBdgProject.getProno(), vBdgProject.getPid());
		}
		return Totalmoney;
	}

	// 工程量签订总金额
	@SuppressWarnings("unchecked")
	public double getConSigedProjectMoney(String conid, String pid) {
		String sql = "select  nvl(sum(nvl(pro.money,0)),0) from bdg_project pro where pro.conid='"
				+ conid + "' and pro.pid='" + pid + "'";
		List list = baseDao.getDataAutoCloseSes(sql);
		if (list.size() > 0) {
			return ((BigDecimal) list.get(0)).doubleValue();
		}
		return 0;
	}

	// 合同工程量变更总金额
	public double getConChangeProjectMoney(String conid, String pid) {
		return getProjectConAppTotalmoney(conid, pid)
				- getConSigedProjectMoney(conid, pid);
	}

	// 概算工程量总金额
	@SuppressWarnings("unchecked")
	public double getBdgProjectAppMoney(String bgdId, String pid) {
		double totalMoney = 0d;
		List list = baseDao.findByWhere(VBdgProject.class.getName(), "bdgid='"
				+ bgdId + "' and pid='" + pid + "'");
		for (int i = 0; i < list.size(); i++) {
			VBdgProject bdg = (VBdgProject) list.get(i);
			totalMoney += getConProjectAppMoney(bdg.getConid(), bdg.getProno(),
					pid);
		}
		return totalMoney;
	}

	// 该工程量分摊总数量
	@SuppressWarnings("unchecked")
	public double getBdgProjectNum(String conid, String prono, String pid) {
		double totalAmount = 0d;
		List list = baseDao.findByWhere(VBdgProject.class.getName(), "conid='"
				+ conid + "' and prono='" + prono + "' and pid='" + pid + "'");
		if (list.size() > 0) {
			VBdgProject vBdgProject = (VBdgProject) list.get(0);
			totalAmount += vBdgProject.getAmount();

			String bdgChangeProjectAmount = "select nvl(sum(nvl(cpro.changeamount,0)),0) from bdg_change_project  cpro where cpro.conid='"
					+ conid
					+ "' and cpro.changeprono='"
					+ prono
					+ "' and cpro.pid='" + pid + "' and cpro.state='3'";
			List bdgChangeProjectAmountList = baseDao
					.getDataAutoCloseSes(bdgChangeProjectAmount);
			if (bdgChangeProjectAmountList.size() > 0) {
				totalAmount += ((BigDecimal) bdgChangeProjectAmountList.get(0))
						.doubleValue();
			}
		}
		return totalAmount;
	}

	// 工程量平均分摊单价
	@SuppressWarnings("unchecked")
	public double getConProjectAppNum(String conid, String prono, String pid) {
		double money = 0d;
		double totalAmount = 0d;
		List list = baseDao.findByWhere(VBdgProject.class.getName(), "conid='"
				+ conid + "' and prono='" + prono + "' and pid='" + pid + "'");
		if (list.size() > 0) {
			VBdgProject vBdgProject = (VBdgProject) list.get(0);
			totalAmount += vBdgProject.getAmount();

			String bdgChangeProjectAmount = "select nvl(sum(nvl(cpro.changeamount,0)),0) from bdg_change_project  cpro where cpro.conid='"
					+ conid
					+ "' and cpro.changeprono='"
					+ prono
					+ "' and cpro.pid='" + pid + "' and cpro.state='3'";
			List bdgChangeProjectAmountList = baseDao
					.getDataAutoCloseSes(bdgChangeProjectAmount);
			if (bdgChangeProjectAmountList.size() > 0) {
				totalAmount += ((BigDecimal) bdgChangeProjectAmountList.get(0))
						.doubleValue();
			}
			List priceChangeList = baseDao.findByWhere(BdgChangeProject.class
					.getName(), "conid='" + conid + "' and changeprono='"
					+ vBdgProject.getProno() + "' and pid='" + pid
					+ "' and state='2'");
			if (priceChangeList.size() > 0) {
				BdgChangeProject bdgChangeProject = (BdgChangeProject) priceChangeList
						.get(0);
				money += (totalAmount - bdgChangeProject.getChangeamount())
						* vBdgProject.getPrice();
				money += bdgChangeProject.getChangemoney();
			} else {
				money += (totalAmount) * vBdgProject.getPrice();
			}
		}
		double res = 0d;

		if (money > 0 && totalAmount > 0) {
			res = (money / totalAmount);
			NumberFormat nbf = NumberFormat.getInstance();
			nbf.setMaximumIntegerDigits(3);
			String r = nbf.format(res);
			return Double.valueOf(r);
		}
		return 0;
	}
	//概算下所有工程量分摊总数
    @SuppressWarnings("unchecked")
	public double bdgProjectTotalMum(String bdgid,String pid){
    	 double totalMum=0d;
    	List list =baseDao.findByWhere(VBdgProject.class.getName(), "bdgid='"+bdgid+"' and pid='"+pid+"'");
    	for(int i=0;i<list.size();i++){
    		VBdgProject vBdgProject=(VBdgProject) list.get(i);
    		totalMum+=getBdgProjectNum(vBdgProject.getConid(),vBdgProject.getProno(),pid);
    	}
    	return 0d;
    }
    //概算下工程量平均值
    public double bdgAvgProjectPrice(String bdgid,String pid){
    	double bdgAvgPrice=0d;
    	double totalMoney=getBdgProjectAppMoney(bdgid,pid);
    	double totalNum =bdgProjectTotalMum(bdgid,pid);
    	if(totalMoney>0&&totalNum>0){
    		double res =totalMoney/totalNum;
    		NumberFormat  nbf = NumberFormat.getInstance();
    		nbf.setMaximumIntegerDigits(3);
    		String r =nbf.format(res);
    		bdgAvgPrice = Double.valueOf(r);
    	}
    	return bdgAvgPrice;
    }
	@SuppressWarnings("unchecked")
	public String checkBdgProjectIsUse(String prono, String conid, String pid) {
		String sql = "select count(*) from pro_acm_info  info where info.proid='"
				+ prono
				+ "' and info.conid ='"
				+ conid
				+ "' and info.pid='"
				+ pid + "'";
		List list = baseDao.getDataAutoCloseSes(sql);
		if (list.size() > 0) {
			int num = ((BigDecimal) list.get(0)).intValue();
			if (num > 0) {
				return "1";
			}
		}
		return "0";
	}

	/**
	 * 根据传入条件关联工程量
	 * @param proid
	 * @param bdgid
	 * @param conid
	 * @author shangtw
	 * @return
	 */
	@SuppressWarnings("all")
	public String relaBdgNewProject(String proid,String bdgid,String conid) {
		String flag = "0";
		String beanName = BusinessConstants.BDG_PACKAGE
				.concat(BusinessConstants.BDG_PROJECT);
		BdgProject bdgProject = (BdgProject) this.baseDao.findById(beanName,
				proid);
		bdgProject.setConid(conid);
		bdgProject.setBdgid(bdgid);
		bdgProject.setMoney(bdgProject.getAmount() * bdgProject.getPrice());
		this.baseDao.saveOrUpdate(bdgProject);
		List dataList = new ArrayList();
		dataList.add(bdgProject);
		if ("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))) {
			if (!dataList.isEmpty()) {
				PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
						.getBean("PCDataExchangeService");
				List ExchangeList = dataExchangeService.getExcDataList(
						dataList, Constant.DefaultOrgRootID,bdgProject.getPid(),"","", "关联工程量");
				dataExchangeService.addExchangeListToQueue(ExchangeList);
			}
		}
		flag = "1";
		return flag;
	}

	/**
	 * 工程量分摊excel数据导入
	 * @param pid	项目ID
	 * @param conid	合同ID	
	 * @param bdgid	概算ID
	 * @param beanName	实体类
	 * @param fileItem	excel文件
	 * @return
	 * @author pengy 2013-08-21
	 */
	public String importData(String pid,String conid,String bdgid,String beanName,FileItem fileItem){
		try {
			Workbook wb = null;
			try {
				// 导入*.xls文件
				InputStream is = fileItem.getInputStream();
				wb = new HSSFWorkbook(is);
				is.close();
			} catch (Exception e) {
				// 导入*.xlsx文件
				InputStream is = fileItem.getInputStream();
				wb = new XSSFWorkbook(is);
				is.close();
			}
			boolean impBool = false;
			Sheet sheet = wb.getSheetAt(0);
			// 判断是否是对于的excel表
			Row row2 = sheet.getRow(1);
			Cell cellA2 = row2.getCell(0);
			//Excel的A2单元格包含“importData”，则为规定的模板
			if (!cellA2.getStringCellValue().equals("importData"))
				return "{success:false,msg:[{result:'模板上传错误！请下载模板填写好数据再上传！'}]}";
			Row row = null;
			Cell cell = null;
			//一个map为一行数据，map存放列名（excel中第二行隐藏的列名，列名和实体属性名对应）和值
			List<Map<String, String>> list = new ArrayList<Map<String,String>>();
			// 得到excel的总记录条数
			int totalRow = sheet.getLastRowNum();
			Row columnRow = null;// 列配置行，单元格的值与bean的属性对应
			for (int i = 0; i <= totalRow; i++) {
				if (i == 0 || i == 1 || i == 2) {
					if (i == 1)	columnRow = sheet.getRow(i);
					continue;
				}else{
					row = sheet.getRow(i);
					Map<String, String> map = new HashMap<String, String>();
					for (int j = 0; j < columnRow.getPhysicalNumberOfCells(); j++) {
						if (j == 0 || j == 1){
							continue;
						}else{
							String cellValue = null;
							cell = row.getCell(j);
							if (cell != null) {
								cell.setCellType(1);
								cellValue = cell.getStringCellValue();
							}
							//为null转为空字符串存放，避免后面对null进行toString()操作
							map.put(columnRow.getCell(j).getStringCellValue(),
									cellValue == null ? "" : cellValue);
						}
					}
					list.add(map);
				}
			}
			
			if(beanName.equals(BdgProject.class.getName())){
				impBool = this.importBdgProject(conid, bdgid, pid, list);
			}
			
			if(impBool)
				return "{success:true,msg:[{result:'上传成功！'}]}";
			else
				return "{success:false,msg:[{result:'上传失败'}]}";
		} catch (Exception e) {
			e.printStackTrace();
			return "{success:false,msg:[{result:'上传失败'}]}";
		}
	}

	/**
	 * 工程量分摊excel数据导入
	 * @param conid	合同ID	
	 * @param bdgid	概算ID
	 * @param pid	项目ID
	 * @param list	导入的数据集合
	 * @return
	 * @author pengy 2013-08-21
	 */
	@SuppressWarnings("unchecked")
	public boolean importBdgProject(String conid,String bdgid,String pid, List<Map<String, String>> list) {
		String sql = "select c.property_code,c.property_name from property_code c where" +
				" c.type_name = (select t.uids from property_type t where t.type_name = '工程量施工单位')";
		List<Object[]> property = baseDao.getDataAutoCloseSes(sql);
		try {
			for (int i = 0; i < list.size(); i++) {
				Map<String, String> map = list.get(i);
				// 新增数据生成主键
				String getID = UUID.randomUUID().toString().replace("-", "");
				
				BdgProject pro = new BdgProject();
				pro.setProappid(getID);
				pro.setPid(pid);
				pro.setConid(conid);
				pro.setBdgid(bdgid);
				String constructionUnit = map.get("constructionUnit").toString();
				for (int j=0; j<property.size(); j++){
					Object[] str = property.get(j);  
					if (str[1].toString().equals(constructionUnit)){
						pro.setConstructionUnit(str[0].toString());
						break;
					}
				}
			   	pro.setProno(map.get("prono"));
			   	pro.setProname(map.get("proname"));
				pro.setUnit(map.get("unit"));
				pro.setPrice(Double.valueOf(map.get("price").equals("") ? "0" : map.get("price")));
				pro.setState("4");
				String amount = map.get("amount");
				if (!amount.equals("") && amount.indexOf("%")>0){
					Double amount1 = Double.valueOf(amount.substring(0, amount.length()-1))/100;
					pro.setAmount(amount1);
					pro.setIsper("1");
				}else {
					pro.setAmount(Double.valueOf(amount.equals("") ? "0" : amount));
					pro.setIsper("0");
				}
				BigDecimal dec = new BigDecimal(pro.getAmount() * pro.getPrice());
				pro.setMoney(dec.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
				this.baseDao.insert(pro);
			}
			return true;
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

}
