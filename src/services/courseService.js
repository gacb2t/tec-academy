import { supabase } from './supabaseClient';

let coursesCache = null;
let lastDepartment = null;

export const courseService = {
    /**
     * Fetch all courses from the database.
     * If a department is provided, it filters the courses.
     */
    async getAvailableCourses(department, forceRefresh = false) {
        if (!forceRefresh && coursesCache && lastDepartment === department) {
            return coursesCache;
        }

        let query = supabase
            .from('courses')
            .select('*')
            .eq('status', 'Published');

        const { data: courses, error } = await query;

        if (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }

        let filteredCourses = courses;
        if (department) {
            // Filter logic: Return courses that are for "Todos" or for the specific department
            filteredCourses = courses.filter((course) => {
                const depts = course.departments || [];
                return depts.includes('Todos') || depts.includes(department);
            });
        }
        
        coursesCache = filteredCourses;
        lastDepartment = department;
        return filteredCourses;
    },

    /**
     * Fetch a single course by ID.
     */
    async getCourseById(id) {
        const { data: course, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching course by ID:', error);
            throw error;
        }

        return course;
    },

    /**
     * Create or update a course (Admin only)
     */
    async saveCourse(courseData) {
        if (courseData.id) {
            // Update existing
            const { data, error } = await supabase
                .from('courses')
                .update(courseData)
                .eq('id', courseData.id)
                .select()
                .single();

            if (error) throw error;
            coursesCache = null; // Invalidate cache
            return data;
        } else {
            // Create new
            const { data, error } = await supabase
                .from('courses')
                .insert([courseData])
                .select()
                .single();

            if (error) throw error;
            coursesCache = null; // Invalidate cache
            return data;
        }
    },

    /**
     * Delete a course (Admin only)
     */
    async deleteCourse(id) {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);

        if (error) throw error;
        coursesCache = null; // Invalidate cache
        return true;
    }
};
