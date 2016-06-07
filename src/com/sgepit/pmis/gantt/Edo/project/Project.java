package com.sgepit.pmis.gantt.Edo.project;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.pmis.gantt.Edo.project.plugins.Calendar;
import com.sgepit.pmis.gantt.Edo.project.plugins.Order;
import com.sgepit.pmis.gantt.Edo.project.plugins.View;
import com.sgepit.pmis.gantt.Edo.util.StringUtil;


public class Project {
	//数据库操作
	public DBAccess db = new DBAccess();
	
	//项目管理算法插件
	public Order order;			//排程算法
	public Calendar calendar;		//日历算法
	
	//项目数据对象
	public Map dataProject = new HashMap();
	
	//视图插件
	public View view = new View();
			
	//任务树
	public List taskTree = new ArrayList();
	//任务哈希表(根据任务UID快速查找任务)
	public Map taskHash = new HashMap();	
	
	public Project(String projectuid) throws Exception{
		Map data = this.Load(projectuid);
		init(data);
	}
	
	public Project(Map data) throws Exception{
		init(data);
	}
	public void init(Map data)throws Exception{
		dataProject = data;
		
		List tasks = (List)data.get("Tasks");		
		this.CreateTaskTree(tasks);
		
		order = new Order(this);
		System.out.println(dataProject.get("CalendarUID"));
		String calendarUidStr = "";
		if(dataProject.get("CalendarUID")!=null){
			calendarUidStr = dataProject.get("CalendarUID").toString();
		}
		
		Map c = GetCalendarByUID(calendarUidStr);
		calendar = new Calendar(c);				
	}
	
	public Map GetView(Map params){
		return view.getView(this.dataProject, params);
	}
	
	/*
	 * 从数据库加载项目数据
	 * 1.项目对象
	 * 2.项目日历
	 * 3.资源
	 * 4.项目任务
	 * 5.任务相关性
	 * 6.比较基准	 
	 * 7.资源分配关系
	 */
	public Map Load(String projectuid) throws Exception{
		Map dataProject;
		//项目对象
		dataProject = db.GetProject(projectuid);
		if(dataProject == null){
			throw new Exception("没有找到项目");
		}
		//项目日历
		dataProject.put("Calendars", db.GetCalendarWidthWeekDays(projectuid));
		//资源
		dataProject.put("Resources", db.GetResources(projectuid));
		
		//任务					
		List tasks = db.GetTasks(projectuid);
		dataProject.put("Tasks", tasks);
		
		//建立快速任务索引, 以备下面任务查询所用
		this.CreateTaskTree(tasks);
		
		//前置任务		
		List predecessorLinks = db.GetPredecessorLinksByProjectUID(projectuid);
		if(predecessorLinks != null){
			for(int i=0,l=predecessorLinks.size(); i<l; i++){
				Map link = (Map) predecessorLinks.get(i);
				Map task = (Map)taskHash.get(link.get("TaskUID").toString());
				if(task == null) continue;
				
				List taskLinks = (List)task.get("PredecessorLink");
				if(taskLinks == null){
					taskLinks = new ArrayList();
					task.put("PredecessorLink", taskLinks);
				}
				taskLinks.add(link);
			}
		}
		//比较基准
		List baselines = db.GetBaselines(projectuid);
		if(baselines != null){
			for(int i=0,l=baselines.size(); i<l; i++){
				Map bl = (Map) baselines.get(i);
				Map task = (Map)taskHash.get(bl.get("TaskUID").toString());										
				if(task == null) continue;
				
				List bls = (List)task.get("Baseline");
				if(bls == null){
					bls = new ArrayList();
					task.put("Baseline", bls);
				}
				bls.add(bl);
			}
		}
        //资源分配关系
        List Assignments = db.GetAssignments(projectuid);
        if (Assignments != null)
        {
            for (int i = 0, l = Assignments.size(); i < l; i++)
            {
                Map a = (Map)Assignments.get(i);
                Map task = (Map)taskHash.get(a.get("TaskUID").toString());
                if (task == null) continue;

                List ass = (List)task.get("Assignments");
                if (ass == null)
                {
                    ass = new ArrayList();
                    task.put("Assignments", ass);
                }
                ass.add(a);
            }
        }
		
		return dataProject;
	}
	/*
	 * 保存(新增)项目数据
	 * 提供两种方式:1.全保存; 2.分块保存
	 * */
	public String Save(Map pj,String projectid) throws Exception{
		//String projectUID = "";		
		String projectUID = projectid;		
		//删除项目
		Delete(pj,projectid);
		/*if(pj.get("UID") != null){
			projectUID = pj.get("UID").toString(); 
			Delete(pj);
		}*/
		//1)新增项目
		//projectUID = db.InsertProject(pj);
		//2)日历
		List calendars = (List)pj.get("Calendars");
		if(calendars != null){
			for(int i=0,l=calendars.size(); i<l; i++){
				Map o = (Map) calendars.get(i);
				o.put("ProjectUID", projectUID);
				db.InsertCalendar(o);					
			}
		}
		//3)资源:resource
		List resources = (List)pj.get("Resources");
		if(resources != null){
			for(int i=0,l=resources.size(); i<l; i++){
				Map o = (Map) resources.get(i);
				o.put("ProjectUID", projectUID);
				db.InsertResource(o);	
			}
		}											
		//4)任务,任务相关性,基准,资源分配关系
		List tasks = (List)pj.get("Tasks");
		if(tasks != null){				     					
			for(int i=0,l=tasks.size(); i<l; i++){
				Map task = (Map) tasks.get(i);
				task.put("ProjectUID", projectUID);
				db.InsertTaskWithOther(task);											
			}
		}
		
		//对当前项目的任务进行层次和节点信息更新
        UpdateTasks(projectUID);                   
		
		return projectUID;
	}	
	public void Delete(Map project,String projectid) throws Exception{
		//String projectuid = project.get("UID").toString();
		String projectuid = projectid;
		//db.DeleteProject(projectuid);
		db.DeleteResource(projectuid);
		db.DeleteCalendar(projectuid);
		db.DeleteWeekDay(projectuid);
		
//任务数据和与任务相关的信息, 跟同任务一起删除, 不直接全部删除(用于分块保存)
//		db.DeleteTask(projectuid);
//		db.DeleteBaseline(projectuid);
//		db.DeletePredecessorLink(projectuid);
//		db.DeleteAssignment(projectuid);		
		
		//将标记过的, 全部删除(连同子任务)
		if (project.get("deleteSave") != null)
        {
            Map<String, Integer> deleteSave = (Map<String, Integer>)project.get("deleteSave");            
            for(Map.Entry<String, Integer> entry : deleteSave.entrySet()){                   
                String taskUID = entry.getKey();   
                db.DeleteTaskAndChildren(taskUID, projectuid);
            }              
        }
		//删除任务自身
		List tasks = (List)project.get("Tasks");
		if(tasks != null){
			//遍历任务,依次全部删除
			for(int i=0,l=tasks.size(); i<l; i++){
				Map task = (Map) tasks.get(i);
				db.DeleteTaskWithOther(task.get("UID").toString(), projectuid, true);				
			}
		}
	}
	/*
	 * 更新项目任务信息
	 * */
    public void UpdateTasks(String projectuid) throws Exception
    {
        //使用OutlineNumber排序获得任务列表(因为ID等信息有可能错误)
    	List tasks = db.GetTasks(projectuid, "order by OutlineNumber");
    	//得到任务树
        List tree = ToTaskTree(tasks, "-1");
        //更新任务列表
    	UploadTasks(tree);        
    }
    public void UploadTasks(List tree) throws Exception{
    	if(tree.size()==0) return;
    	String projectuid = ((Map)tree.get(0)).get("ProjectUID").toString();    	                      
        if(StringUtil.isNullOrEmpty(projectuid)) throw new Exception("ProjectUID不能为空");
        
        //同步更新所有任务信息
        com.sgepit.pmis.gantt.Edo.project.Project.SyncTasks(tree, 1, "", "-1");
        //删除所有任务(不包括相关数据)
        db.DeleteTask(projectuid);
        //批量新增任务(不包括相关数据)
        db.InsertTasks(ToTaskList(tree));
    }
	
    public void CreateTaskTree(List tasks)
    {
    	
        taskTree = new ArrayList();
        taskHash = new HashMap();
        
        //建立任务快速查询索引哈希
        for(int i=0,l=tasks.size(); i<l; i++){
        	Map task = (Map)tasks.get(i);        
            taskHash.put(task.get("UID"), task);
        }
        
        //创建任务树        
        taskTree = ToTaskTree(tasks, "-1");
    }
    
    //获得任务的下级子任务集合
    public List GetTaskChildren(String taskUID)
    {
        if (taskUID.equals("-1"))
        {
            return taskTree;
        }
        else
        {
            Map p = (Map)taskHash.get(taskUID);
            return (List)p.get("children");
        }
    }    
    
    /*
     * 判断parentTask是否是task的父级任务
     * */
    public Boolean isAncestor(Map parentTask, Map task)
    {
    	//TODO: 可以改造, 从task的ParentTaskUID向上遍历找, 更快
        List parentChildren = GetTaskChildren(parentTask.get("UID").toString());

        if (parentChildren != null)
        {
            for (int i = 0, l = parentChildren.size(); i < l; i++)
            {
                Map c = (Map)parentChildren.get(i);
                if (c == task) return true;
                Boolean r = isAncestor(c, task);
                if (r == true) return true;
            }
        }
        return false;
    }    
    public Map GetCalendarByUID(String calendarUID) throws SQLException{
    	List calendars = (List)dataProject.get("Calendars");
    	for(int i=0,l=calendars.size(); i<l; i++){
    		Map calendar = (Map)calendars.get(i);
    		if(calendar.get("UID").toString().equals(calendarUID)) return calendar;
    	}
    	return null;
    }
    
    //根据任务和前置任务, 找出它们的前置任务关系对象
    public static Map GetPredecessorLink(Map task, Map pre){                
        String preUID = pre.get("UID").toString();
        List links = (List)task.get("PredecessorLink");
        for(int i=0,l=links.size(); i<l; i++){
            Map link = (Map)links.get(i);
            if(preUID.equals(link.get("PredecessorUID"))) return link;
        }
        return null;
    }
    
	/*
	 * 将任务数组,转换成任务树(以"children"作为子任务树属性)
	 * 注: 任务数组, 必须按outlinenumber或ID排序
	 * */
    public static List ToTaskTree(List tasks, String parentTaskUID)
    {
    	if(parentTaskUID.equals("-1")){
    		tasks = new ArrayList(tasks);
    	}
        List children = new ArrayList();
        for(int i=0,l=tasks.size(); i<l; i++){
        	Map task = (Map)tasks.get(i);
        	
        	if (task.get("ParentTaskUID") == null) continue;
            if (task.get("ParentTaskUID").toString().equals(parentTaskUID))
            {
                children.add(task);
                String[] ots = task.get("OutlineNumber").toString().split("\\.");
                
                task.put("number", new Integer(ots[ots.length - 1]));                
            }
        }      
        //需要对children进行下排序 根据outlinenumber最后一个数字
        for (int i = 0, l = children.size(); i < l; i++)
        {                
            for (int j = children.size() - 1; j >= i; j--)
            {
                Map t1 = (Map)children.get(i);
                Map t2 = (Map)children.get(j);
                if (new Integer(t1.get("number").toString()) > new Integer(t2.get("number").toString()))
                {
                    children.set(i, t2);
                    children.set(j, t1);
                }
            }
        }
        for(int i=0,l=children.size(); i<l; i++){
        	Map task = (Map)children.get(i);
        	
        	tasks.remove(task);
        	task.remove("number");
        }        
        
        for(int i=0,l=children.size(); i<l; i++){
        	Map task = (Map)children.get(i);
        	
        	task.put("children", ToTaskTree(tasks, task.get("UID").toString()));
        	
        }          
        return children;
    }
    //将任务树,转换成任务数组
    public static List ToTaskList(List tree){
    	List list = new ArrayList();
        for (int i=0, len =tree.size(); i < len; i++)
        {
            Map task = (Map)tree.get(i);
            
            list.add(task);

            List children = (List)task.get("children");

            if (children != null && children.size() > 0)
            {                
            	List list2 = ToTaskList(children);
            	list.addAll(list2);
            }
        }
        return list;
    }     
    
    public static int TaskID = 1;
    /*
     * 将任务树,按层次和顺序,同步ID,OutlineLevel,OutlineNumber,ParentTaskUID,Summary等信息
     * */
    public static void SyncTasks(List tree, int outlineLevel, String outlineNumber, String parentTaskUID) throws Exception
    {
    	if(outlineLevel < 1) throw new Exception("OutlineLevel不能小于1,应该从1开始");
        if (outlineLevel == 1)
        {
            TaskID = 1;
            outlineNumber = "";
            parentTaskUID = "-1";
        }
        int i = 0, len = tree.size();
        for (; i < len; i++)
        {
            Map task = (Map)tree.get(i);

            task.put("ID", TaskID++);

            task.put("OutlineLevel", outlineLevel);
            task.put("OutlineNumber", outlineNumber + (i + 1));

            task.put("ParentTaskUID", parentTaskUID);

            List children = (List)task.get("children");

            if (children != null && children.size() > 0)
            {
                task.put("Summary", 1);
                SyncTasks(children, outlineLevel + 1, task.get("OutlineNumber").toString() + ".", task.get("UID").toString());
            }
            else
            {
                task.put("Summary", 0);
            }
        }
    }    
    
}
