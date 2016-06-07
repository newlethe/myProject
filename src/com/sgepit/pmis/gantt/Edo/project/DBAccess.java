package com.sgepit.pmis.gantt.Edo.project;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.sgepit.pmis.gantt.Edo.sql.DaoFactory;
import com.sgepit.pmis.gantt.Edo.util.StringUtil;
import com.sgepit.pmis.gantt.Edo.util.UUID;


public class DBAccess {
	//查询
    public Map GetProject(String projectuid) throws SQLException
    {
    	return (Map)DaoFactory.getDao().queryForObject("EdoProject.getProjectByUID", projectuid);        
    }
    public List GetCalendars(String projectuid) throws SQLException
    {
    	return (List)DaoFactory.getDao().queryForList("EdoProject.getCalendarsByProjectUID", projectuid);        
    }
    public List GetWeekDays(String projectuid) throws SQLException
    {
    	return (List)DaoFactory.getDao().queryForList("EdoProject.getWeekDaysByProjectUID", projectuid);        
    }
    public List GetResources(String projectuid) throws SQLException
    {
    	return (List)DaoFactory.getDao().queryForList("EdoProject.getResourcesByProjectUID", projectuid);        
    }
    public List GetAssignments(String projectuid) throws SQLException
    {
    	return (List)DaoFactory.getDao().queryForList("EdoProject.getAssignmentsByProjectUID", projectuid);        
    }
    public List GetPredecessorLinksByProjectUID(String projectuid) throws SQLException
    {
    	return (List)DaoFactory.getDao().queryForList("EdoProject.getPredecessorLinksByProjectUID", projectuid);        
    }
    public List GetBaselines(String projectuid) throws SQLException
    {
    	return (List)DaoFactory.getDao().queryForList("EdoProject.getBaselinesByProjectUID", projectuid);        
    }
    public List GetTasks(String projectuid, String orderBy) throws SQLException{
    	Map o = new HashMap();
    	o.put("ProjectUID", projectuid);
    	o.put("orderby", orderBy);    	
    	return (List)DaoFactory.getDao().queryForList("EdoProject.getTasksByProjectUID", o);	
    }    
    public List GetTasks(String projectuid) throws SQLException
    {    	       
    	return GetTasks(projectuid, "order by ID");
    }

    public Map GetTaskByTaskUID(String taskUID, String projectuid) throws SQLException
    {
    	Map o = new HashMap();
        o.put("TaskUID", taskUID);
        o.put("ProjectUID", projectuid);        
        return (Map)DaoFactory.getDao().queryForObject("EdoProject.getTaskByUID", o);
    }
    
    //新增
	public String InsertProject(Map project) throws Exception{		
		if(project.get("UID") == null){
			project.put("UID", UUID.randomUUID().toString());	
		}
		DaoFactory.getDao().insert("EdoProject.insertProject", project);
		return project.get("UID").toString();
	}    
    public String InsertTask(Map task) throws Exception{
    	if(task.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
    	if(task.get("ParentTaskUID") == null) throw new Exception("ParentTaskUID");
    	if(task.get("UID") == null){
    		task.put("UID",UUID.randomUUID().toString());
    	}
//    	if(task.get("Hyperlink").toString().equals("null")){
//    		task.put("Hyperlink", "");
//    	}
    	DaoFactory.getDao().insert("EdoProject.insertTask", task);
    	
    	return task.get("UID").toString();
    }
    //批量新增任务数组
    public void InsertTasks(List tasks) throws Exception{    	
    	for(int i=0,l=tasks.size(); i<l; i++){
    		Map task = (Map)tasks.get(i);
    		InsertTask(task);
    	}
    }
	public void InsertResource(Map o) throws Exception{	
		if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().insert("EdoProject.insertResource", o);		
	}
	public void InsertPredecessorLink(Map o) throws Exception{
		if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().insert("EdoProject.insertPredecessorLink", o);		
	}
	public void InsertBaseline(Map o) throws Exception{				
		if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().insert("EdoProject.insertBaseline", o);		
	}
	public void InsertAssignment(Map o) throws Exception{			
		if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().insert("EdoProject.insertAssignment", o);		
	}    
	public void InsertCalendar(Map o) throws Exception{				
		if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().insert("EdoProject.insertCalendar", o);
		
		String CalendarUID = o.get("UID").toString();
		String ProjectUID = o.get("ProjectUID").toString();
		
		List weekdays = (List)o.get("WeekDays");
		if(weekdays != null){
			for(int i=0,l=weekdays.size(); i<l; i++){
				Map weekday = (Map) weekdays.get(i);
				weekday.put("CalendarUID", CalendarUID);
				weekday.put("ProjectUID", ProjectUID);
				InsertWeekDay(weekday);	
			}
		}
	}	
	public void InsertWeekDay(Map o) throws Exception{		
		if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		List wts = (List)o.get("WorkingTimes");
		if(wts != null){
			int len = wts.size();
	        for (int i = 0; i < 9; i++)
	        {
	        	int index = i + 1; 
	        	
	            String fromtime = null;
	            String totime = null;
	            if (len > i)
	            {
	            	Map wt = (Map)wts.get(i);
	                fromtime = (String)wt.get("FromTime");
	                totime = (String)wt.get("ToTime");
	            }
	            o.put("WorkingTimeFromTime"+index, fromtime);
	            o.put("WorkingTimeToTime"+index, totime);
	        }
		}
        Map TimePeriod = (Map)o.get("TimePeriod");
        o.put("TimePeriodFromDate", TimePeriod==null?null:TimePeriod.get("FromDate"));
        o.put("TimePeriodToDate", TimePeriod==null?null:TimePeriod.get("ToDate"));
			
		DaoFactory.getDao().insert("EdoProject.insertWeekDay", o);				
	}	
	//删除
	//根据项目UID删除
	public void DeleteProject(String projectuid) throws Exception{
    	Map o = new HashMap();        
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteProject", o);		
	}
	public void DeleteResource(String projectuid) throws Exception{
    	Map o = new HashMap();        
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteResource", o);		
	}
	public void DeleteCalendar(String projectuid) throws Exception{
    	Map o = new HashMap();        
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteCalendar", o);		
	}
	public void DeleteWeekDay(String projectuid) throws Exception{
    	Map o = new HashMap();        
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteWeekDay", o);		
	}
	public void DeleteTask(String projectuid) throws Exception{
    	Map o = new HashMap();        
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteTask", o);		
	}
	public void DeleteBaseline(String projectuid) throws Exception{
    	Map o = new HashMap();        
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteBaseline", o);		
	}
	public void DeletePredecessorLink(String projectuid) throws Exception{
    	Map o = new HashMap();        
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deletePredecessorLink", o);		
	}
	public void DeleteAssignment(String projectuid) throws Exception{
    	Map o = new HashMap();        
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteAssignment", o);		
	}
	//根据任务UID删除
	public void DeleteTaskByTaskUID(String TaskUID,String projectuid) throws Exception{
    	Map o = new HashMap(); 
    	o.put("TaskUID", TaskUID);
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteTaskByTaskUID", o);		
	}  
	public void DeleteBaselineByTaskUID(String TaskUID, String projectuid) throws Exception{
    	Map o = new HashMap();       
    	o.put("TaskUID", TaskUID);
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteBaselineByTaskUID", o);		
	}  
	public void DeleteAssignmentByTaskUID(String TaskUID, String projectuid) throws Exception{
    	Map o = new HashMap();   
    	o.put("TaskUID", TaskUID);
        o.put("ProjectUID", projectuid);
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deleteAssignmentByTaskUID", o);		
	}  
	public void DeletePredecessorLinkByTaskUID(String TaskUID, String projectuid) throws Exception{
    	Map o = new HashMap(); 
    	o.put("TaskUID", TaskUID);
        o.put("ProjectUID", projectuid); 
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deletePredecessorLinkByTaskUID", o);		
	}
	public void DeletePredecessorLinkByPredecessorUID(String PredecessorUID, String projectuid) throws Exception{
    	Map o = new HashMap(); 
    	o.put("PredecessorUID", PredecessorUID);
        o.put("ProjectUID", projectuid);
        if(o.get("ProjectUID") == null) throw new Exception("必须传递ProjectUID");
		DaoFactory.getDao().delete("EdoProject.deletePredecessorLinkByPredecessorUID", o);		
	}
	
	//获得任务的所有下级任务
    public List GetTaskChildrenAll(String OutlineNumber, String projectuid) throws Exception
    {
    	Map o = new HashMap();
        o.put("key", OutlineNumber+".%");
        o.put("ProjectUID", projectuid);
        
        return (List)DaoFactory.getDao().queryForList("EdoProject.getTaskChildrenAll", o);        
    }	
    //日历+工作日设置
    public List GetCalendarWidthWeekDays(String projectuid) throws SQLException{
		//日历
		List calendars = GetCalendars(projectuid);
		List weekdays = GetWeekDays(projectuid);
		if(calendars != null){
			//遍历日历
			for(int x = 0, y=calendars.size(); x< y; x++){				
				Map calendar = (Map) calendars.get(x);				
				String calendaruid = calendar.get("UID").toString();
				
				//遍历工作日, 找出属于此日期的工作日
		        ArrayList weekdays2 = new ArrayList();
		        for(int j=0,k=weekdays.size(); j<k; j++){
		        	Map weekday = (Map)weekdays.get(j);
		            if (weekday.get("CalendarUID").toString().equals(calendaruid))
		            {
		                Map wd = new HashMap();
		                wd.put("DayType", weekday.get("DayType"));
		                wd.put("DayWorking", weekday.get("DayWorking"));

						//工作时间								
						List workingtimes = new ArrayList();
						for (int i = 0; i < 9; i++)
		                {
		                    int index = i + 1;		                                
		                    if (!StringUtil.isNullOrEmpty(weekday.get("WorkingTimeFromTime" + index)))
		                    {
		                        Map WorkingTime = new HashMap();
		                        workingtimes.add(WorkingTime);
		                        WorkingTime.put("FromTime", weekday.get("WorkingTimeFromTime" + index));
		                        WorkingTime.put("ToTime", weekday.get("WorkingTimeToTime" + index));                                    
		                    }
		                }                            
		                wd.put("WorkingTimes", workingtimes);
		                
						//例外日期
						if(!StringUtil.isNullOrEmpty(weekday.get("TimePeriodFromDate")))
		                {
							Map TimePeriod =  new HashMap();
		                    wd.put("TimePeriod", TimePeriod);
		                    TimePeriod.put("FromDate", weekday.get("TimePeriodFromDate"));
		                    TimePeriod.put("ToDate", weekday.get("TimePeriodToDate"));
		                    wd.put("Name", weekday.get("Name"));
		                }

		                weekdays2.add(wd);
		            }
		        }
		        calendar.put("WeekDays", weekdays2);
								
			}
		}
		
		return calendars; 	
    }    
	/*
	 * 删除任务(包括任务下的所有子任务)
	 * */
    public void DeleteTaskAndChildren(String taskUID, String projectuid) throws Exception
    {
        Map task = GetTaskByTaskUID(taskUID, projectuid);
        if(task == null) return;
        List tasks = GetTaskChildrenAll(task.get("OutlineNumber").toString(), projectuid);

        DeleteTaskWithOther(task.get("UID").toString(), projectuid, true);               
        
        Iterator it = tasks.iterator();
		while (it.hasNext()) {
			Map t = (Map) it.next();
			
			DeleteTaskWithOther(t.get("UID").toString(), projectuid, true);			
		}	
    }	
    /*
     * 删除任务(包括任务的相关数据,如前置任务/资源分配关系/比较基准等)
     * 注: 如果有扩展的任务属性,如"负责人","部门"等, 请扩展此方法一并删除
     * */
    public void DeleteTaskWithOther(String TaskUID, String projectuid, Boolean all) throws Exception
    {
    	Map o = new HashMap();
        o.put("TaskUID", TaskUID);
        o.put("ProjectUID", projectuid);
        
        DeleteTaskByTaskUID(TaskUID, projectuid);
        DeleteBaselineByTaskUID(TaskUID, projectuid);
        DeleteAssignmentByTaskUID(TaskUID, projectuid);
        DeletePredecessorLinkByTaskUID(TaskUID, projectuid);

        if (all)
        {
            //本任务作为前置任务, 也一并删除
            DeletePredecessorLinkByPredecessorUID(TaskUID, projectuid);            
        }        
    }
    /*
     * 新增任务(包括任务的相关数据,如前置任务/资源分配关系/比较基准等)
     * 注: 如果有扩展的任务属性,如"负责人","部门"等, 请扩展此方法一并新增
     * */
    public String InsertTaskWithOther(Map task) throws Exception
    {
        String projectUID = task.get("ProjectUID").toString();
        //新增任务
        String uid = InsertTask(task);
        task.put("UID", uid);
        
		//任务相关性
		List links = (List)task.get("PredecessorLink");
		if(links != null){
			for(int i=0,l=links.size(); i<l; i++){
				Map o = (Map) links.get(i);
				o.put("ProjectUID", projectUID);
				InsertPredecessorLink(o);
			}			
		}
		
		//比较基准
		List Baselines = (List)task.get("Baseline");
		if(Baselines != null){
			for(int i=0,l=Baselines.size(); i<l; i++){
				Map o = (Map) Baselines.get(i);
				o.put("Number", new Integer(i++));	//比较基准的排序字段
				o.put("TaskUID", task.get("UID"));
				o.put("ProjectUID", projectUID);
				InsertBaseline(o);
			}			
		}
		
		//资源分配:Assignments
		List assignments = (List)task.get("Assignments");
		if(assignments != null){
			for(int i=0,l=assignments.size(); i<l; i++){
				Map o = (Map) assignments.get(i);
				o.put("ProjectUID", projectUID);
				InsertAssignment(o);
			}				
		}
		
        return uid;
    }    
    //查询任务
    public List QueryTaskByName(String taskName, String projectuid) throws Exception
    {
    	Map ps = new HashMap();            
        ps.put("key", "%" + taskName + "%");
        ps.put("ProjectUID", projectuid);
        return DaoFactory.getDao().queryForList("EdoProject.queryTaskByName", ps);
    }
    //查询资源
    public List QueryResourceByName(String resourceName, String projectuid) throws Exception
    {
    	Map ps = new HashMap();
        ps.put("key", "%" + resourceName + "%");
        ps.put("ProjectUID", projectuid);
        return DaoFactory.getDao().queryForList("EdoProject.queryResourceByName", ps);
    }        
}
