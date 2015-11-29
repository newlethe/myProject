package com.sgepit.frame.sysman.dao;

import java.util.List;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
//import com.sgepit.lab.ocean.luceneSearch.LuceneMgm;
import com.sgepit.frame.sysman.hbm.SgccAttachBlob;
import com.sgepit.frame.sysman.hbm.SgccAttachList;

public class SgccAttachListDAO extends IBaseDAO {
	
	protected void initDao() {
		sBeanName = "com.sgepit.frame.sysman.hbm.SgccAttachList";
	}
	
	public static SgccAttachListDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (SgccAttachListDAO) ctx.getBean("sgccAttachListDAO");
	}
	public static SgccAttachListDAO getInstance() {
		return (SgccAttachListDAO) Constant.wact.getBean("sgccAttachListDAO");
	}
    
	
	/**
	 * 删除附件（包括大对象）
	 * @param transactionID
	 * @param transactionType
	 * @return
	 */
	public void deleteAttachList(String transactionID,String transactionType,String indexDir)throws Exception{
		List list = findWhere("transaction_id='"+transactionID+"' and transaction_type='"+transactionType+"'");
		if(list!=null&&list.size()>0){
			SgccAttachList attach = null;
			SgccAttachBlob blob = null;
			for (int i = 0; i < list.size(); i++) {
				attach = (SgccAttachList)list.get(i);
				String fileLsh = attach.getId().getFileLsh();
				if(attach.getFileSource()!=null&&attach.getFileSource().equals("ftp")){
					deleteFileOnFtp(attach.getId().getFileLsh(), transactionType);
				}else{
					blob = (SgccAttachBlob)findById("com.sgepit.frame.sysman.hbm.SgccAttachBlob", fileLsh);
					delete(blob);
				}
				/*if(indexDir != null && !indexDir.equals("")){
					LuceneMgm luceneMgm= new LuceneMgm();				
					luceneMgm.delIndex(fileLsh,indexDir);
				}*/				
				delete(attach);
			}
		}
	}
}