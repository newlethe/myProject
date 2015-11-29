package com.sgepit.pmis.gantt.Edo.util;

import java.util.ArrayList;
import java.util.List;

public class ArrayUtil {
    public static List GetRange(List list, int start, int count){
    	List rs = new ArrayList();
    	for(int i=start,l=start+count; i<l; i++){
    		rs.add(list.get(i));
    	}
    	return rs;
    }
    public static void RemoveRange(List list, int start, int count){
    	for(int i=start+count-1; i>= start; i--){
    		list.remove(i);
    	}
    }
    public static void AddRange(List list, List arr){    	
    	for(int i=0,l=arr.size(); i<l; i++){
    		list.add(arr.get(i));
    	}
    }
}
