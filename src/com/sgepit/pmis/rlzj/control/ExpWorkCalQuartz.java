package com.sgepit.pmis.rlzj.control;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

import com.sgepit.frame.util.JdbcUtil;

public class ExpWorkCalQuartz extends QuartzJobBean {
	@Override
	protected void executeInternal(JobExecutionContext arg0)
			throws JobExecutionException {
		
		String sql="select SEQNUM,ENTRYDATE,WORKYEARS  from HR_MAN_CONTRACT";
       List<Map> list=JdbcUtil.query(sql); 
       for(int i=0;i<list.size();i++){
    	    String seqNum=    (String)list.get(i).get("SEQNUM");
    	    Date entryDate=(Date)list.get(i).get("ENTRYDATE");
    	    java.math.BigDecimal workYears=(java.math.BigDecimal)(list.get(i).get("WORKYEARS"));
    	    int workyears=0;
    	    if(workYears!=null)
    	    	workyears=workYears.intValue();
    		Date nowDate=new Date();
            long times=nowDate.getTime()-entryDate.getTime();
            int years=(int)(times/1000/60/60/24/365);
            if(years==workyears)
            	break;
            String update="update HR_MAN_CONTRACT set WORKYEARS="+years+" where SEQNUM="+seqNum;
            JdbcUtil.execute(update);
       }
	}

}
