package com.sgepit.pmis.gantt.Edo.util;

public class Convert {
	public static int doubleToInt(double d){
		int i = 0;
		i -= d;
		return -i;
	}
	public static long doubleToLong(double d){
		long i = 0;
		i -= d;
		return -i;
	}
}
