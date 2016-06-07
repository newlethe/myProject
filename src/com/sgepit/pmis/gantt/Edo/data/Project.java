package com.sgepit.pmis.gantt.Edo.data;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.sgepit.pmis.gantt.Edo.util.Json;
import com.sgepit.pmis.gantt.Edo.util.UUID;
import com.sgepit.pmis.gantt.Edo.util.StringUtil;
import com.sgepit.pmis.gantt.Edo.sql.DaoFactory;

import com.sgepit.pmis.gantt.Edo.project.plugins.*;

public class Project {
	public static Map SetData(String projectString,String projectid){
		HashMap result = new HashMap();
		
		Map pj = null;
		try{
		pj = (Map)Json.decode(projectString);
		}catch(Exception e){
			result.put("error", new Integer(-1));
			result.put("errormsg", "JSON反序列化错误:"+e.getMessage());
			return result;
		}
		
		String projectUID = "";		
		try {									
			DaoFactory.getDao().startTransaction();
			
			com.sgepit.pmis.gantt.Edo.project.Project project = new com.sgepit.pmis.gantt.Edo.project.Project(pj);
			projectUID = project.Save(pj,projectid);					
			
			DaoFactory.getDao().commitTransaction();
			
			result.put("result", projectUID);
			result.put("error", new Integer(0));
		}catch (Exception e) {
			e.printStackTrace();
			result.put("error", new Integer(-1));
			result.put("errormsg", e.getMessage());
		}finally{
			try {
				DaoFactory.getDao().endTransaction();
			} catch (SQLException e) {			
				e.printStackTrace();
			}
		}				
		result.put("result", projectUID);
		return result;
	}
	public static Map GetData(String projectuid, Map params, boolean useLazy){
		Map result = new HashMap();
		Map project = null;		
		try {
			com.sgepit.pmis.gantt.Edo.project.Project pj = new com.sgepit.pmis.gantt.Edo.project.Project(projectuid);
			if(useLazy){
				pj.view = new LazyView();
			}
			result.put("result", pj.GetView(params));
			result.put("error", new Integer(0));
		} catch (Exception e) {
			result.put("error", new Integer(-1));
			result.put("errormsg", e.getMessage());
			e.printStackTrace();
		}							
		return result;
	}	
}