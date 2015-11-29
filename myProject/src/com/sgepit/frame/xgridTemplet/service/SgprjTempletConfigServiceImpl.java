package com.sgepit.frame.xgridTemplet.service;

import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.xgridTemplet.dao.SgprjTempletConfigDAO;
import com.sgepit.frame.xgridTemplet.hbm.SgprjTempletConfig;

public class SgprjTempletConfigServiceImpl implements SgprjTempletConfigService {
	private static final Log log = LogFactory.getLog(SgprjTempletConfigServiceImpl.class);
	private SgprjTempletConfigDAO sgprjTempletConfigDAO;

	public SgprjTempletConfigDAO getSgprjTempletConfigDAO() {
		return sgprjTempletConfigDAO;
	}

	public void setSgprjTempletConfigDAO(SgprjTempletConfigDAO sgprjTempletConfigDAO) {
		this.sgprjTempletConfigDAO = sgprjTempletConfigDAO;
	}

	public List<SgprjTempletConfig> findorderby(String beanName,
			String orderBy, Integer start, Integer limit) {
		List<SgprjTempletConfig> list = null; 
		if(beanName!=null&&!beanName.equals("")){
			list = sgprjTempletConfigDAO.findByWhere(beanName, " 1=1", orderBy, start, limit);
		}
		return list;
	}

	public void deleteSgprjTempletConfig(SgprjTempletConfig sgprjTempletConfig) {
		log.info("delete template : fileid=" + sgprjTempletConfig.getTempletFile());
		String fileid = sgprjTempletConfig.getTempletFile();
		if (fileid!= null && fileid.length()>0) {
			ApplicationMgmFacade appMgm = (ApplicationMgmFacade) Constant.wact.getBean("applicationMgm");
			appMgm.deleteFile(fileid);
		}
		this.sgprjTempletConfigDAO.delete(sgprjTempletConfig);
		
	}

	public void insertSgprjTempletConfig(SgprjTempletConfig sgprjTempletConfig) {
		this.sgprjTempletConfigDAO.insert(sgprjTempletConfig);
		
	}

	public void updateSgprjTempletConfig(SgprjTempletConfig sgprjTempletConfig) {
		this.sgprjTempletConfigDAO.saveOrUpdate(sgprjTempletConfig);
		
	}
	
	public String getXgridHeader(String templetSn){
		List list = JdbcUtil.query("select templet_header header from sgprj_templet_config where templet_sn='"+templetSn+"'");
		if(list!=null&&list.size()>0){
			Map<String, String> map = (Map<String, String>) list.get(0);
			return map.get("header");
		}
		return null;
	}
}
