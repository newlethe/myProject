package com.sgepit.pcmis.aqgk.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.hibernate.Session;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.dataexchange.PCDataExchangeException;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.FileManagementService;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.aqgk.dao.AqgkDAO;
import com.sgepit.pcmis.aqgk.hbm.PcAqgkAccidenrInfo;
import com.sgepit.pcmis.aqgk.hbm.PcAqgkFeedbackInfo;
import com.sgepit.pcmis.aqgk.hbm.PcAqgkHiddenDangerInfo;
import com.sgepit.pcmis.aqgk.hbm.PcAqgkInspectionBatInfo;
import com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetyChange;
import com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetymonthInfo;
import com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetytrainInfo;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;

public class PCAqgkServiceImpl implements PCAqgkService{
	private AqgkDAO aqgkDAO;

	public AqgkDAO getAqgkDAO() {
		return aqgkDAO;
	}

	public void setAqgkDAO(AqgkDAO aqgkDAO) {
		this.aqgkDAO = aqgkDAO;
	}
	/**
	 * 安全事故、安全月报、安全培训 的上报 按钮实现。
	 * @since 2011-11-20 需要判断是否进行数据交互 ，liangwj
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void report(String accident_uids,String businessType,String bean,String pid){
		if(accident_uids.equals("")){
			
		}else{
			//只允许yi
			String uids="('"+accident_uids.replaceAll(",", "','")+"')";
			String sql="uids in "+uids;
			List accidentList = aqgkDAO.findByWhere2(bean,sql);
			
			FileManagementService fileManagementServiceImp=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
			String whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID in"+uids;
			List<SgccAttachList> attachList = fileManagementServiceImp.geAttachListByWhere(whereSql, null, null);
			
			List allDataList=new ArrayList();
			allDataList.addAll(accidentList);
			allDataList.addAll(attachList);
			
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List<PcDataExchange> exchangeList = exchangeServiceImp.getExchangeDataList(allDataList,pid);
			
			PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
			Long curXh = tempExc.getXh() + 1;
			String curTxGroup = tempExc.getTxGroup();
			for (int i = 0; i <attachList.size(); i++) {
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("SGCC_ATTACH_BLOB");
				exchange.setBlobCol("FILE_NR");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("FILE_LSH", attachList.get(i).getFileLsh());
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setXh(curXh + i);
				exchange.setPid(pid);
				exchange.setTxGroup(curTxGroup);
				exchangeList.add(exchange);
			}
			
			exchangeServiceImp.sendExchangeData(exchangeList);
		}

	}
	/**
	 * 反馈意见新增或修改时数据交互
	 * @param uids
	 * @param pid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String excDataOpinionForSaveOrUpdate(String uids, String fromUnit, String toUnit,String bizInfo){
		try{
			PcAqgkFeedbackInfo feedHbm = (PcAqgkFeedbackInfo) aqgkDAO.findById(PcAqgkFeedbackInfo.class.getName(), uids);
			if(feedHbm==null){
				return "0";
			}else{
				SgccIniUnit unitHbm = (SgccIniUnit) aqgkDAO.findBeanByProperty(SgccIniUnit.class.getName(), "unitid", toUnit);
				
				//判断是否需要数据交互
				if(Constant.propsMap.get("DEPLOY_UNITTYPE").toString().equals("0")&&
						unitHbm!=null&&unitHbm.getAppUrl()!=null)
				{
					List<PcAqgkFeedbackInfo> feedBackList = new ArrayList<PcAqgkFeedbackInfo>();
					feedBackList.add(feedHbm);
					try{
						PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
						List<PcDataExchange> excList1 =excService.getExcDataList(feedBackList, toUnit, 
																		fromUnit, null, null, bizInfo);
						Map<String,String> rtnMap =  excService.sendExchangeData(excList1);
						if(!(rtnMap.get("result").equals("success"))){//发送失败，添加到队列
							excService.addExchangeListToQueue(excList1);
						}
					}catch (PCDataExchangeException e) {
						e.printStackTrace();
					}
				}
			}
		}catch (BusinessException e) {
			e.printStackTrace();
			return "0";
		}
		return "1";
	}
	/**
	 * 反馈意见删除，符合数据条件时需要进行数据交互
	 * @param uids
	 * @param fromUnit
	 * @param toUnit
	 * @param bizInfo
	 * @return
	 */
	public String excDataOpinionForDel(String uids, String fromUnit, String toUnit,String bizInfo){
		try{
			PcAqgkFeedbackInfo feedHbm = (PcAqgkFeedbackInfo) aqgkDAO.findById(PcAqgkFeedbackInfo.class.getName(), uids);
			if(feedHbm==null){
				return "0";
			}else{
				SgccIniUnit unitHbm = (SgccIniUnit) aqgkDAO.findBeanByProperty(SgccIniUnit.class.getName(), "unitid", toUnit);
				//判断是否需要数据交互
				if(Constant.propsMap.get("DEPLOY_UNITTYPE").toString().equals("0")&&
						unitHbm!=null&&unitHbm.getAppUrl()!=null){
					String sqlData="delete from PC_AQGK_FEEDBACK_INFO where uids='"+uids+"'";
					
					List<PcDataExchange> excList = new ArrayList<PcDataExchange>();
					
					PcDataExchange pdEcx = new PcDataExchange();
					pdEcx.setPid(toUnit);
					pdEcx.setTableName("PC_AQGK_FEEDBACK_INFO");
					pdEcx.setTxGroup(SnUtil.getNewID("tx-"));
					pdEcx.setXh(1L);
					pdEcx.setSuccessFlag("0");
					pdEcx.setSqlData(sqlData);
					pdEcx.setBizInfo(bizInfo);
					pdEcx.setSpareC5(fromUnit);//发送单位
					
					excList.add(pdEcx);
					try{
						PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
						Map<String,String> rtnMap =  excService.sendExchangeData(excList);
						if(!(rtnMap.get("result").equals("success"))){//发送失败，添加到队列
							excService.addExchangeListToQueue(excList);
						}
					}catch (PCDataExchangeException e) {
						e.printStackTrace();
					}
				}
				aqgkDAO.delete(feedHbm);
			}
		}catch (BusinessException e) {
			e.printStackTrace();
			return "0";
		}
		return "1";
	}
	/**
	 * 安全事故报送
	 * @param uids 主键ID
	 * @param businessType 附件类型
	 * @param fromUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String excDataAqsg(String uids, String businessType,
			String fromUnit, String toUnit) {
		String flag = "1";
		try{
				PcAqgkAccidenrInfo accidentHbm = (PcAqgkAccidenrInfo) aqgkDAO.findById(PcAqgkAccidenrInfo.class.getName(),uids);
				if(accidentHbm==null){
					flag="0";
					return flag;
				}else{
					PcDynamicData dyda=new PcDynamicData();
					dyda.setPid(accidentHbm.getPid());
					dyda.setPctablebean(PcAqgkAccidenrInfo.class.getName());
					dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcAqgkAccidenrInfo.class.getName()));
					dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
					dyda.setPctableuids(accidentHbm.getUids());
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.SECURITY_ACC_URL);
					
					Session session =aqgkDAO.getSessionFactory().openSession();
					session.beginTransaction();
					session.save(dyda);
					session.getTransaction().commit();
					session.close();
					
					FileManagementService fileService=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
					
					String whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID = '"+uids+"'";
					List<SgccAttachList> attachList = fileService.geAttachListByWhere(whereSql, null, null);
					
					List allDataList=new ArrayList();
					allDataList.add(accidentHbm);//安全事故主记录
					allDataList.add(dyda);
					allDataList.addAll(attachList);//附件信息
					
					
					String sqlAfter = "update  PC_AQGK_ACCIDENR_INFO set REPORT_STATUS=1 where uids='"+uids+"'";//修改上报状态
					String bizInfo = "安全事故上报【事故单位："+accidentHbm.getAccidentunit()+"】";
					
					PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List<PcDataExchange> exchangeList = excService.getExcDataList(allDataList, toUnit, fromUnit ,null, sqlAfter,bizInfo);
					//大对象处理
					PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
					Long curXh = tempExc.getXh() + 1;
					String curTxGroup = tempExc.getTxGroup();
					for (int i = 0; i <attachList.size(); i++) {
						PcDataExchange exchange = new PcDataExchange();
						exchange.setTableName("SGCC_ATTACH_BLOB");
						exchange.setBlobCol("FILE_NR");
						JSONArray kvarr = new JSONArray();
						JSONObject kv = new JSONObject();
						kv.put("FILE_LSH", attachList.get(i).getFileLsh());
						kvarr.add(kv);
						exchange.setKeyValue(kvarr.toString());
						exchange.setSuccessFlag("0");
						exchange.setXh(curXh + i);
						exchange.setPid(toUnit);
						exchange.setTxGroup(curTxGroup);
						exchange.setSpareC5(fromUnit);
						exchange.setBizInfo(bizInfo);
						
						exchangeList.add(exchange);
					}
					
					Map<String,String> rtnMap = excService.sendExchangeData(exchangeList);
					if(rtnMap.get("result").equals("success")){
						accidentHbm.setReportStatus(1L);//修改上报状态
						this.aqgkDAO.saveOrUpdate(accidentHbm);
					}else{
						flag="0";
					}
				}
		}catch (PCDataExchangeException e) {
			e.printStackTrace();
		}
		return flag;
	}
	/**
	 * 安全培训报送
	 * @param uids 主键ID
	 * @param businessType 附件类型
	 * @param fromUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String excDataAqpx(String uids, String businessType,
			String fromUnit, String toUnit) {
		String flag = "1";
		try{
				PcAqgkSafetytrainInfo trainHbm = (PcAqgkSafetytrainInfo) aqgkDAO.findById(PcAqgkSafetytrainInfo.class.getName(),uids);
				if(trainHbm==null){
					flag="0";
					return flag;
				}else{
					PcDynamicData dyda=new PcDynamicData();
					dyda.setPid(trainHbm.getPid());
					dyda.setPctablebean(PcAqgkSafetytrainInfo.class.getName());
					dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcAqgkSafetytrainInfo.class.getName()));
					dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
					dyda.setPctableuids(trainHbm.getUids());
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.SECURITY_TRAIN_URL);
					
					Session session =aqgkDAO.getSessionFactory().openSession();
					session.beginTransaction();
					session.save(dyda);
					session.getTransaction().commit();
					session.close();
					
					FileManagementService fileService=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
					
					String whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID = '"+uids+"'";
					List<SgccAttachList> attachList = fileService.geAttachListByWhere(whereSql, null, null);
					
					List allDataList=new ArrayList();
					allDataList.add(trainHbm);//安全事故主记录
					allDataList.add(dyda);
					allDataList.addAll(attachList);//附件信息
					
					String sqlAfter = "update  PC_AQGK_SAFETYTRAIN_INFO set TRAIN_STATUS=1 where uids='"+uids+"'";//修改上报状态
					String bizInfo = "安全培训上报【培训内容："+trainHbm.getTraincontent()+"】";
					
					PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List<PcDataExchange> exchangeList = excService.getExcDataList(allDataList, toUnit, fromUnit ,null, sqlAfter,bizInfo);
					//大对象处理
					PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
					Long curXh = tempExc.getXh() + 1;
					String curTxGroup = tempExc.getTxGroup();
					for (int i = 0; i <attachList.size(); i++) {
						PcDataExchange exchange = new PcDataExchange();
						exchange.setTableName("SGCC_ATTACH_BLOB");
						exchange.setBlobCol("FILE_NR");
						JSONArray kvarr = new JSONArray();
						JSONObject kv = new JSONObject();
						kv.put("FILE_LSH", attachList.get(i).getFileLsh());
						kvarr.add(kv);
						exchange.setKeyValue(kvarr.toString());
						exchange.setSuccessFlag("0");
						exchange.setXh(curXh + i);
						exchange.setPid(toUnit);
						exchange.setTxGroup(curTxGroup);
						exchange.setSpareC5(fromUnit);
						exchange.setBizInfo(bizInfo);
						
						exchangeList.add(exchange);
					}
					
					Map<String,String> rtnMap = excService.sendExchangeData(exchangeList);
					if(rtnMap.get("result").equals("success")){
						trainHbm.setTrainStatus(1L);//修改上报状态
						this.aqgkDAO.saveOrUpdate(trainHbm);
					}else{
						flag="0";
					}
				}
		}catch (PCDataExchangeException e) {
			e.printStackTrace();
		}
		return flag;
	}
	/**
	 * 安全月报报送
	 * @param uids 主键ID
	 * @param businessType 附件类型
	 * @param fromUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String excDataAqyb(String uids, String businessType,
			String fromUnit, String toUnit) {
		String flag = "1";
		try{
				PcAqgkSafetymonthInfo monthHbm = (PcAqgkSafetymonthInfo) aqgkDAO.findById(PcAqgkSafetymonthInfo.class.getName(),uids);
				if(monthHbm==null){
					flag="0";
					return flag;
				}else{
					PcDynamicData dyda=new PcDynamicData();
					dyda.setPid(monthHbm.getPid());
					dyda.setPctablebean(PcAqgkSafetymonthInfo.class.getName());
					dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcAqgkSafetymonthInfo.class.getName()));
					dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
					dyda.setPctableuids(monthHbm.getUids());
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.SECURITY_REPORT_URL);
					
					Session session =aqgkDAO.getSessionFactory().openSession();
					session.beginTransaction();
					session.save(dyda);
					session.getTransaction().commit();
					session.close();
					
					FileManagementService fileService=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
					
					String whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID = '"+uids+"'";
					List<SgccAttachList> attachList = fileService.geAttachListByWhere(whereSql, null, null);
					
					List allDataList=new ArrayList();
					allDataList.add(monthHbm);//安全事故主记录
					allDataList.add(dyda);
					allDataList.addAll(attachList);//附件信息
					
					String sqlAfter = "update PC_AQGK_SAFETYMONTH_INFO set state='1' where uids='"+uids+"'";//修改上报状态
					String bizInfo = "安全月报上报【月报标题："+monthHbm.getTitle()+"】";
					
					PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List<PcDataExchange> exchangeList = excService.getExcDataList(allDataList, toUnit, fromUnit ,null, sqlAfter,bizInfo);
					//大对象处理
					PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
					Long curXh = tempExc.getXh() + 1;
					String curTxGroup = tempExc.getTxGroup();
					for (int i = 0; i <attachList.size(); i++) {
						PcDataExchange exchange = new PcDataExchange();
						exchange.setTableName("SGCC_ATTACH_BLOB");
						exchange.setBlobCol("FILE_NR");
						JSONArray kvarr = new JSONArray();
						JSONObject kv = new JSONObject();
						kv.put("FILE_LSH", attachList.get(i).getFileLsh());
						kvarr.add(kv);
						exchange.setKeyValue(kvarr.toString());
						exchange.setSuccessFlag("0");
						exchange.setXh(curXh + i);
						exchange.setPid(toUnit);
						exchange.setTxGroup(curTxGroup);
						exchange.setSpareC5(fromUnit);
						exchange.setBizInfo(bizInfo);
						
						exchangeList.add(exchange);
					}
					
					Map<String,String> rtnMap = excService.sendExchangeData(exchangeList);
					if(rtnMap.get("result").equals("success")){
						monthHbm.setState("1");//修改上报状态
						this.aqgkDAO.saveOrUpdate(monthHbm);
					}else{
						flag="0";
					}
				}
		}catch (PCDataExchangeException e) {
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 保存,修改, 删除安全隐患信息之后更新对应检验批次表中的数据(针对多个检查批次有更新)
	 * @param insertOrUpdateUids 被新增,修改安全隐患主键值集合, 或者被删除安全隐患的主键集合(删除是单选的)
	 * @param deleteUids 被删除安全隐患对应检验批次主键
	 */
	@SuppressWarnings("unchecked")
	public void InspectionsInfoUpdate(List<String> insertOrUpdateUids, String deleteUids){
		Set set = new HashSet();
		if(deleteUids==null){
			for(Iterator<String> itor = insertOrUpdateUids.iterator(); itor.hasNext();)
			{
				PcAqgkHiddenDangerInfo hdBean = (PcAqgkHiddenDangerInfo) this.aqgkDAO.findById(PcAqgkHiddenDangerInfo.class.getName(), itor.next());
				if(!set.contains(hdBean.getBatUids())){
					set.add(hdBean.getBatUids());
				}
			}
		} else {
			set.add(deleteUids);
		}
		
		for(Iterator<String> itor = set.iterator(); itor.hasNext();)
		{
			String uids = itor.next();
			updateInspectionSingle(uids); //循环调用单个检查批次的更新方法
		}
 	}
	
	/**
	 * 删除检验批和该检验批次下所有的安全隐患信息
	 * @param uids 
	 */
	@SuppressWarnings("unchecked")
	public void deleteInspectionInfo(String uids){
		PcAqgkInspectionBatInfo batBean = 
			(PcAqgkInspectionBatInfo) this.aqgkDAO.findById(PcAqgkInspectionBatInfo.class.getName(), uids);
		List<PcAqgkHiddenDangerInfo> list = 
					this.aqgkDAO.findByWhere2(PcAqgkHiddenDangerInfo.class.getName(),"batUids='" + uids + "'");
		this.aqgkDAO.deleteAll(list);
		this.aqgkDAO.delete(batBean);
	}
	
	/**
	 * 集团二级公司将新增,修改的检验批次信息加入到数据发送队列,然后发送给项目单位
	 * @param insertUpdateUids 新增和修改的所有检验批次主键
	 * @param fromUnit  数据交互发送单位
	 * @param toUnit    数据交互接收单位
	 * @param bizInfo  数据交换说明信息
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public void excDataInspectionForSaveOrUpdate(List<String> insertUpdateUids, String toUnit,String fromUnit)
	{
		List<PcAqgkInspectionBatInfo> dataList = new ArrayList<PcAqgkInspectionBatInfo>();
		if(insertUpdateUids.size()==0)
			return;
		String bizInfo = "安全管控-检验批次信息";
		String mKeys = insertUpdateUids.toString().replaceAll(" ", "").
											 replace("[", "('").replace("]", "')").replace(",", "','");
		String whereSql = "uids in" + mKeys;
		dataList = this.aqgkDAO.findByWhere(PcAqgkInspectionBatInfo.class.getName(), whereSql);
		PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		List<PcDataExchange> exchangeList = 
								excService.getExcDataList(dataList, toUnit, fromUnit, null, null, bizInfo);
		excService.addExchangeListToQueue(exchangeList);
	}
	
	/**
	 * 安全隐患信息的数据交换
	 * @param insertUpdateUids 新增和修改的所有安全隐患主键
	 * @param fromUnit  数据交互发送单位
	 * @param toUnit    数据交互接收单位
	 * @param bizInfo
	 * @return
	 */
	@SuppressWarnings("unchecked") 
	public void excDataHDForSaveOrUpdate(List<String> insertUpdateUids, String toUnit, String fromUnit)
	{
		if(insertUpdateUids.size()==0)
			return;
		String bizInfo = "安全管控-安全隐患信息";
		String keys  = insertUpdateUids.toString().replaceAll(" ", "").
											 replace("[", "('").replace("]", "')").replace(",", "','");
		String whereSql = "uids in" + keys;
		List<PcAqgkHiddenDangerInfo> hdBeans = this.aqgkDAO.findByWhere(PcAqgkHiddenDangerInfo.class.getName(), whereSql);
		
		//获得修改的安全隐患所关联的所有安全检验批次
		Set inspectionSet = new HashSet();
		for(Iterator itor = hdBeans.iterator(); itor.hasNext();)
		{
			PcAqgkHiddenDangerInfo hdBean = (PcAqgkHiddenDangerInfo)itor.next();
			inspectionSet.add(hdBean.getBatUids());
		}
		
		String uids = inspectionSet.toString().replaceAll(" ", "").
												 replace("[", "('").replace("]", "')").replace(",", "','");
		
		List<PcAqgkInspectionBatInfo> inspectionBeans = this.aqgkDAO.findByWhere2(PcAqgkInspectionBatInfo.class.getName(), 
																										"uids in"+uids); 
		List dataList = new ArrayList();
		dataList.addAll(hdBeans);
		dataList.addAll(inspectionBeans);
		
		PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		List<PcDataExchange> exchangeList = 
								excService.getExcDataList(dataList, toUnit, fromUnit, null, null, bizInfo);
		excService.addExchangeListToQueue(exchangeList);
	}
	
	/**
	 * 集团二级公司删除一条检验批次之后
	 * @param uids 被删除检验批次主键
	 * @param fromUnit 发送端单位编号
	 * @param toUnit 接收端单位编号
	 */
	@SuppressWarnings("unchecked")
	public void excDataInspectionForDelete(String uids, String toUnit, String fromUnit)
	{
		String bizInfo = "安全管控-检验批次信息";
		
		PcDataExchange exchange = new PcDataExchange();
		exchange.setTableName("PC_AQGK_INSPECTION_BAT_INFO");
		exchange.setSqlData("delete pc_aqgk_inspection_bat_info where uids='" + uids + "'");
		exchange.setKeyValue(SnUtil.getNewID("SQL-"));
		exchange.setSuccessFlag("0");
		exchange.setBizInfo(bizInfo);
		exchange.setXh(0L);
		exchange.setSpareC5(fromUnit);
		exchange.setPid(toUnit);
		String txGroup = SnUtil.getNewID("tx-");
		exchange.setTxGroup(txGroup);
		
		List<PcDataExchange> exchangeList = new ArrayList<PcDataExchange>();
		exchangeList.add(exchange);
		
		PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		excService.addExchangeListToQueue(exchangeList);
	}
	
	/**
	 * 集团二级公司删除一条安全隐患之后与项目单位进行数据交换
	 * @param uids 被删除安全隐患主键
	 * @param batUids 被删除安全隐患所属检验批次主键
	 * @param fromUnit 发送端单位编号(只可能是二级公司才可以删除具体的安全隐患信息)
	 * @param toUnit 接收端单位编号(项目单位)
	 */
	@SuppressWarnings("unchecked")
	public void excDataHDForDelete(String uids, String batUids, String toUnit, String fromUnit)
	{
		//找到被删除的安全隐患所属检验批次
		List<PcAqgkInspectionBatInfo> beanList = this.aqgkDAO.findByWhere(PcAqgkInspectionBatInfo.class.getName(), 
																				"uids='" + batUids + "'");
		
		PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		List<PcDataExchange> exchangeList = excService.getExcDataList(beanList, toUnit, fromUnit, 
																					null, null, "安全管控-检验批次信息");
		
		String bizInfo = "安全管控-安全隐患信息";
		
		PcDataExchange exchange = new PcDataExchange();
		exchange.setTableName("PC_AQGK_HIDDENDANGER_INFO");
		exchange.setSqlData("delete pc_aqgk_hiddendanger_info where uids='" + uids + "'");
		exchange.setKeyValue(SnUtil.getNewID("SQL-"));
		exchange.setSuccessFlag("0");
		exchange.setBizInfo(bizInfo);
		
		exchange.setXh(new Long(exchangeList.size()));
		
		exchange.setSpareC5(fromUnit);
		exchange.setPid(toUnit);
		exchange.setTxGroup(exchangeList.get(0).getTxGroup());  //加入到同一个事务中
		
		exchangeList.add(exchange);
		excService.addExchangeListToQueue(exchangeList);
	}
	
	/**
	 * 更新单个检查批次信息(在导入安全隐患后调用该方法,同时在更新多个检验批次信息中会多次调用)
	 * @param batUids  检验批次主键
	 */
	@SuppressWarnings("unchecked")
	public void updateInspectionSingle(String batUids)
	{
		PcAqgkInspectionBatInfo inspectionBean = 
				(PcAqgkInspectionBatInfo) this.aqgkDAO.findById(PcAqgkInspectionBatInfo.class.getName(), batUids);
		
		StringBuffer sqlBuffer = new StringBuffer();
		sqlBuffer.append("select t.* from ( select count(*) from pc_aqgk_hiddendanger_info " +
																"where bat_uids = '"+ batUids +"' and state='0'");
		sqlBuffer.append(" union all select count(*) from pc_aqgk_hiddendanger_info " +
																"where bat_uids = '"+ batUids +"' and state='1'");
		sqlBuffer.append(" union all select count(*) from pc_aqgk_hiddendanger_info " +
																"where bat_uids = '"+ batUids +"' and state='2') t");
		
		List list = this.aqgkDAO.getDataAutoCloseSes(sqlBuffer.toString());
		//修改检验批次的"未整改", "长期坚持","整改完成"对应字段的值
		BigDecimal wzgCount = (BigDecimal)list.get(0);
		BigDecimal cqjcCount = (BigDecimal)list.get(1);
		BigDecimal zgCount = (BigDecimal)list.get(2);
		
		inspectionBean.setWzgCount(wzgCount.longValue());
		inspectionBean.setCqjcCount(cqjcCount.longValue());
		inspectionBean.setZgCount(zgCount.longValue());
		
		//修改"发现隐患"字段值
		Long dangerCount = wzgCount.longValue() + cqjcCount.longValue() + zgCount.longValue();
		inspectionBean.setDangerCount(dangerCount);
		
		//设置整改完成率字段值
//		if(dangerCount==0)
//		{
//			inspectionBean.setZgwcl(0.0);
//		}
//		else
//		{	
//			inspectionBean.setZgwcl((zgCount.doubleValue() + cqjcCount.doubleValue())/dangerCount.doubleValue());
//		}
	}
	
	/**
	 * Excel导入安全隐患成功后调用该方法, 同步检验批次表和安全隐患表
	 * @param batUids
	 */
	@SuppressWarnings("unchecked")
	public void exchangeDateForImport(String batUids, String toUnit, String fromUnit)
	{
		List dataList = new ArrayList();	
		//检验批次
		PcAqgkInspectionBatInfo inspectionBean = 
						(PcAqgkInspectionBatInfo) this.aqgkDAO.findById(PcAqgkInspectionBatInfo.class.getName(), batUids);
		dataList.add(inspectionBean);
		
		//该检验批次下的所有安全隐患
		String whereSql = "pid='"+toUnit+"' and bat_uids='"+batUids+"'";
		List hdList = this.aqgkDAO.findByWhere(PcAqgkHiddenDangerInfo.class.getName(), whereSql);
		dataList.addAll(hdList);
		
		PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		List<PcDataExchange> exchangeList = excService.getExcDataList(dataList, toUnit, fromUnit, 
																					null, null, "安全管控-检验批次和安全隐患信息");
		excService.addExchangeListToQueue(exchangeList);
	}
	
	/**
	 * 安全管理模块获得各项目单位一周内的上传的附件数
	 * @prame afterDate  一周前的日期表示格式"2012-08-01"
	 * @return List  返回元素为 [pid, 附件数] 的List
	 */
	@SuppressWarnings("unchecked")
	public List getAttachNumberForPrj(String afterDate)
	{
		List list = new ArrayList();
		
		List<String> pidList = 
					this.aqgkDAO.getDataAutoCloseSes("select unitid from sgcc_ini_unit where unit_type_id='A'");
		if(pidList.size() > 0)
		{	
			for(int i=0; i<pidList.size(); i++)
			{   
				List item = new ArrayList();
				String pid = pidList.get(i);
				item.add(pid);
				
				String sql = "select count(*) from sgcc_attach_list where transaction_id in"
					+ "(select uids from com_file_info where pid='"+ pid +"' and " 
					+ "to_char(file_createtime,'yyyy-mm-dd')>='" + afterDate + "' and " 
					+ "report_status='1' and file_sort_id in " 
					+ "(select uids from com_file_sort connect by prior uids=parent_id start with " 
					+ "uids='aqxxbs' or uids='aqwmsg' or uids='aqsgjc' or uids='201207271425434940000')) "
					+ "and transaction_type='FAPAttach'";
				
				String number = this.aqgkDAO.getDataAutoCloseSes(sql).get(0).toString();
				item.add(number);
				list.add(item);
			}
		}
		
		return list;
	}
	
	
	/**
	 * 获取UUID和记录总数，返回的内容以`分割
	 * @param pid
	 * @return
	 */
	public String getUuidAndRecordCount(String pid) {
		String rtn = UUID.randomUUID().toString().replaceAll("-", "");
		List list = this.aqgkDAO.findByWhere(
				PcAqgkSafetyChange.class.getName(), "pid = '" + pid + "'");
		if (list == null) {
			return rtn + "`1";
		} else {
			return rtn + "`" + (list.size() + 1);
		}
	}
}
