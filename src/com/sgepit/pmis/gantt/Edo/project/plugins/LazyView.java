package com.sgepit.pmis.gantt.Edo.project.plugins;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class LazyView extends View {
    /*
     * 根据父任务UID, 加载任务(loadAll:true全部;false只加载下一级)
     * */
    public static List getTasks(String parentTaskUID, Boolean loadAll, List tasks){    	    
    	//找出父任务对象
    	Map parentTask = null;
		if(tasks != null){
			Iterator it = tasks.iterator();
			while (it.hasNext()) {
				Map o = (Map) it.next();
				if(o.get("UID").toString().equals(parentTaskUID)){
					parentTask = o;
					break;
				}						
			}
		}
		//父级任务的层级信息		
		String poutlinenumber = "";
        int poutlinelevel = -1;
        if (parentTask != null)
        {
            poutlinenumber = parentTask.get("OutlineNumber").toString() + ".";
            poutlinelevel = new Integer(parentTask.get("OutlineLevel").toString());
        }        
        //筛选出子任务
        List tasks2 = new ArrayList();
        if(tasks != null){
			Iterator it = tasks.iterator();
			while (it.hasNext()) {
				Map task = (Map) it.next();
				
				String outlinenumber = task.get("OutlineNumber").toString();
                int outlinelevel = new Integer(task.get("OutlineLevel").toString());

                if (parentTask == null)//如果没有父任务
                {
                    if (loadAll || outlinelevel == 1)
                    {
                        tasks2.add(task);
                    }
                }
                else if (outlinenumber.indexOf(poutlinenumber) == 0)//如果任务在父任务之下
                {
                    if (loadAll)//如果是全部加载
                    {
                        tasks2.add(task);
                    }
                    else//如果是只加载父任务下一层任务
                    {
                        if (poutlinelevel + 1 == outlinelevel)
                        {
                            tasks2.add(task);
                        }
                    }
                }
				if(task.get("Summary").toString().equals("1")){                    
                    if(loadAll == false){
                    	//如果是摘要任务, 且loadAll为false, 则必定为expanded=false
                    	task.put("expanded", false);
                    	task.put("__viewicon", 1);
                    }
                } 
			}
		}
        return tasks2;
    }
	public Map getView(Map project, Map params){		
		List tasks = (List)project.get("Tasks");
		String parentTaskUID = params.get("parentTaskUID").toString();		
		boolean loadAll = Boolean.parseBoolean(params.get("loadAll").toString());	
		project.put("Tasks", getTasks(parentTaskUID, loadAll, tasks));
		
		clear(project);
		return project;
	}
}
