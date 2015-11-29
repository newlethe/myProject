package com.sgepit.pmis.equipment.service;

import java.util.List;

import com.sgepit.pmis.equipment.hbm.EquOpenBox;
import com.sgepit.pmis.equipment.hbm.EquOpenBoxSub;


/**
 * @ConAccinfoMgmFacade 合同帐目信息-业务逻辑接口
 * @author Xiaosa
 */
public interface OpenBoxMgmFacade {
	public int delOpenBox(String uuid);
	public void saveOrUpdate(EquOpenBox eb);
	public String insertEquOpenBox(EquOpenBox eb, String uuids);
	public List equGoodsSub(String conId);
	public void insertSelectEqu(String conid,String[] ids,String partb);
	public String  saveOpenBoxSub(EquOpenBoxSub sub);
	public void saveall(String boxno);
	public void deleteBoxno(String uuid);
	public String checkDeleteOpenSub(String[] ids);
	public void changedhzt(String ggId,String sbid,String opendate);
}
