package com.sgepit.pmis.gantt.Edo.project.plugins;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.sgepit.pmis.gantt.Edo.util.Convert;
import com.sgepit.pmis.gantt.Edo.util.DateUtil;
import com.sgepit.pmis.gantt.Edo.util.StringUtil;

public class View {	
	public Map getView(Map project, Map params){
		clear(project);
		return project;
	}
	//清除任务/资源等信息额外的附加属性,从而减少数据量
	public void clear(Map project){
        //资源
		List resources = (List)project.get("Resources");
        for (int i = 0, l = resources.size(); i < l; i++)
        {
        	Map r = (Map)resources.get(i);
            r.remove("ProjectUID");
        }

        //日历
        List calendars = (List)project.get("Calendars");
        for (int i = 0, l = calendars.size(); i < l; i++)
        {
        	Map c = (Map)calendars.get(i);
            c.remove("ProjectUID");
            
        }
        
		List tasks = (List)project.get("Tasks");
		for(int i=0,l=tasks.size(); i<l; i++){
			Map task = (Map)tasks.get(i);
			task.remove("children");
			task.remove("ProjectUID");
			task.remove("ParentTaskUID");			
			
			List PredecessorLink = (List)task.get("PredecessorLink");
			if(PredecessorLink != null){
				for(int j=0,k=PredecessorLink.size(); j<k; j++){
					Map link = (Map)PredecessorLink.get(j);
					link.remove("PredecessorName");
					link.remove("PredecessorID");
					link.remove("ProjectUID");
				}
			}
			
			List Assignments = (List)task.get("Assignments");
			if(Assignments != null){
				for(int j=0,k=Assignments.size(); j<k; j++){
					Map a = (Map)Assignments.get(j);
					a.remove("ResourceName");
					a.remove("ResourceType");
					a.remove("ProjectUID");
				}
			}
			
			List Baselines = (List)task.get("Baseline");
			if(Baselines != null){
				for(int j=0,k=Baselines.size(); j<k; j++){
					Map b = (Map)Baselines.get(j);
					b.remove("ProjectUID");					
				}
			}
		}
		
	}
}
